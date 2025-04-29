import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max, IsIn } from 'class-validator';

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @IsNotEmpty()
  @IsString()
  instructions: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  // Advanced search fields
  @IsOptional()
  @IsNumber()
  @Min(0)
  prepTime?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cookTime?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietaryTags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  difficulty?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mealType?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cuisine?: string[];
}
