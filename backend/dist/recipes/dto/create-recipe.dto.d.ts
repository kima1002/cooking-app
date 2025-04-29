export declare class CreateRecipeDto {
    name: string;
    ingredients: string[];
    instructions: string;
    imageUrl?: string;
    isPublic?: boolean;
    prepTime?: number;
    cookTime?: number;
    dietaryTags?: string[];
    difficulty?: number;
    mealType?: string[];
    cuisine?: string[];
}
