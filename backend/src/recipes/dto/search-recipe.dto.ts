import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class SearchRecipeDto {
  @IsOptional()
  @IsString()
  query?: string; // General search query for recipe name or ingredients
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[]; // Search by specific ingredients
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietaryTags?: string[]; // Filter by dietary restrictions (vegan, gluten-free, etc.)
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrepTime?: number; // Maximum preparation time in minutes
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxCookTime?: number; // Maximum cooking time in minutes
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxTotalTime?: number; // Maximum total time (prep + cook) in minutes
  
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3)
  difficulty?: number; // Filter by difficulty level
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mealType?: string[]; // Filter by meal type
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cuisine?: string[]; // Filter by cuisine
  
  @IsOptional()
  @IsBoolean()
  onlyPublic?: boolean; // Whether to show only public recipes
}