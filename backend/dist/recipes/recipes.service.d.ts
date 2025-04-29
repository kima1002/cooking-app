import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from './recipe.schema';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { CreateCommentDto } from './dto/comment.dto';
import { SearchRecipeDto } from './dto/search-recipe.dto';
export declare class RecipesService {
    private recipeModel;
    constructor(recipeModel: Model<RecipeDocument>);
    create(createRecipeDto: CreateRecipeDto, userId: string): Promise<Recipe>;
    findAll(userId: string): Promise<Recipe[]>;
    findAllPublic(): Promise<Recipe[]>;
    searchRecipes(searchDto: SearchRecipeDto, userId?: string): Promise<Recipe[]>;
    getRecommendedRecipes(userId: string): Promise<Recipe[]>;
    findUserRecipes(userId: string): Promise<Recipe[]>;
    findOne(id: string, userId: string): Promise<Recipe>;
    update(id: string, updateRecipeDto: UpdateRecipeDto, userId: string): Promise<Recipe>;
    remove(id: string, userId: string): Promise<void>;
    toggleLike(recipeId: string, userId: string): Promise<Recipe>;
    addComment(recipeId: string, userId: string, createCommentDto: CreateCommentDto): Promise<Recipe>;
    getComments(recipeId: string, userId: string): Promise<any[]>;
}
