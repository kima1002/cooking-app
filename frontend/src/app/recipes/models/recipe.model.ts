import { User } from '../../auth/models/user.model';

export interface Comment {
  _id?: string;
  userId: string | User;
  text: string;
  createdAt: Date;
}

export interface Recipe {
  _id?: string;
  name: string;
  ingredients: string[];
  instructions: string;
  imageUrl?: string;
  userId: string | User;
  isPublic: boolean;
  likesCount: number;
  likedBy: string[] | User[];
  comments: Comment[];
  createdAt?: Date;
  updatedAt?: Date;
  // Advanced search fields
  prepTime?: number;
  cookTime?: number;
  dietaryTags?: string[];
  difficulty?: number;
  mealType?: string[];
  cuisine?: string[];
}

export interface SearchRecipeParams {
  query?: string;
  ingredients?: string[];
  dietaryTags?: string[];
  maxPrepTime?: number;
  maxCookTime?: number;
  maxTotalTime?: number;
  difficulty?: number;
  mealType?: string[];
  cuisine?: string[];
  onlyPublic?: boolean;
}