export declare class SearchRecipeDto {
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
