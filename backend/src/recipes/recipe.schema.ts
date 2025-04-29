import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/user.schema';

export type RecipeDocument = Recipe & Document;

@Schema({ _id: false })
export class Comment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ timestamps: true })
export class Recipe {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: [String] })
  ingredients: string[];

  @Prop({ required: true })
  instructions: string;

  @Prop()
  imageUrl: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  likedBy: User[];

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];
  
  // Advanced search fields
  @Prop({ default: 0 })
  prepTime: number; // in minutes
  
  @Prop({ default: 0 })
  cookTime: number; // in minutes
  
  @Prop({ default: [] })
  dietaryTags: string[]; // e.g., 'vegan', 'gluten-free', 'low-carb'
  
  @Prop({ default: 0 })
  difficulty: number; // 1-3 scale (easy, medium, hard)
  
  @Prop({ default: [] })
  mealType: string[]; // e.g., 'breakfast', 'lunch', 'dinner', 'dessert'
  
  @Prop({ default: [] })
  cuisine: string[]; // e.g., 'italian', 'mexican', 'asian'
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);