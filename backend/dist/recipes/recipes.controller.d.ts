import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { CreateCommentDto } from './dto/comment.dto';
import { SearchRecipeDto } from './dto/search-recipe.dto';
export declare class RecipesController {
    private readonly recipesService;
    constructor(recipesService: RecipesService);
    create(createRecipeDto: CreateRecipeDto, user: any): Promise<import("./recipe.schema").Recipe>;
    findAll(user: any): Promise<import("./recipe.schema").Recipe[]>;
    findAllPublic(): Promise<import("./recipe.schema").Recipe[]>;
    searchRecipesGet(searchDto: SearchRecipeDto, user?: any): Promise<import("./recipe.schema").Recipe[]>;
    searchRecipes(searchDto: SearchRecipeDto, user?: any): Promise<import("./recipe.schema").Recipe[]>;
    getRecommendedRecipes(user: any): Promise<import("./recipe.schema").Recipe[]>;
    findOne(id: string, user: any): Promise<import("./recipe.schema").Recipe>;
    update(id: string, updateRecipeDto: UpdateRecipeDto, user: any): Promise<import("./recipe.schema").Recipe>;
    remove(id: string, user: any): Promise<void>;
    toggleLike(id: string, user: any): Promise<import("./recipe.schema").Recipe>;
    addComment(id: string, user: any, createCommentDto: CreateCommentDto): Promise<import("./recipe.schema").Recipe>;
    getComments(id: string, user: any): Promise<any[]>;
}
export declare class UserRecipesController {
    private readonly recipesService;
    constructor(recipesService: RecipesService);
    findUserRecipes(user: any): Promise<import("./recipe.schema").Recipe[]>;
    createUserRecipe(createRecipeDto: CreateRecipeDto, user: any): Promise<import("./recipe.schema").Recipe>;
    updateUserRecipe(id: string, updateRecipeDto: UpdateRecipeDto, user: any): Promise<import("./recipe.schema").Recipe>;
    removeUserRecipe(id: string, user: any): Promise<void>;
}
