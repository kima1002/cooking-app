import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../users/user.schema';
export type RecipeDocument = Recipe & Document;
export declare class Comment {
    userId: User;
    text: string;
    createdAt: Date;
}
export declare class Recipe {
    name: string;
    ingredients: string[];
    instructions: string;
    imageUrl: string;
    userId: User;
    isPublic: boolean;
    likesCount: number;
    likedBy: User[];
    comments: Comment[];
    prepTime: number;
    cookTime: number;
    dietaryTags: string[];
    difficulty: number;
    mealType: string[];
    cuisine: string[];
}
export declare const RecipeSchema: MongooseSchema<Recipe, import("mongoose").Model<Recipe, any, any, any, Document<unknown, any, Recipe> & Recipe & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Recipe, Document<unknown, {}, import("mongoose").FlatRecord<Recipe>> & import("mongoose").FlatRecord<Recipe> & {
    _id: import("mongoose").Types.ObjectId;
}>;
