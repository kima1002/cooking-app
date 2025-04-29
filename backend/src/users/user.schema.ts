import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

export interface UserDocument extends User, Document {
  validatePassword(password: string): boolean;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  surname: string;

  @Prop()
  bio: string;

  @Prop()
  personality: string;
  
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to hash password
UserSchema.pre('save', function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    
    // Generate a salt
    const salt = bcrypt.genSaltSync(10);
    
    // Hash the password with the salt
    const hashedPassword = bcrypt.hashSync(this.password, salt);
    
    // Replace the password with the hashed one
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to validate password
UserSchema.methods.validatePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};