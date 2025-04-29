import { Document } from 'mongoose';
export interface UserDocument extends User, Document {
    validatePassword(password: string): boolean;
}
export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare class User {
    email: string;
    password: string;
    name: string;
    surname: string;
    bio: string;
    personality: string;
    role: UserRole;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
}>;
