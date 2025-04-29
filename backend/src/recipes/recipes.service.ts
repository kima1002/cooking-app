import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from './recipe.schema';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { CreateCommentDto } from './dto/comment.dto';
import { SearchRecipeDto } from './dto/search-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto, userId: string): Promise<Recipe> {
    const newRecipe = new this.recipeModel({
      ...createRecipeDto,
      userId,
    });
    return newRecipe.save();
  }

  async findAll(userId: string): Promise<Recipe[]> {
    return this.recipeModel
      .find({
        $or: [
          { userId: userId },
          { isPublic: true }
        ]
      })
      .sort({ createdAt: -1 })
      .populate('userId', 'name surname')
      .exec();
  }

  async findAllPublic(): Promise<Recipe[]> {
    return this.recipeModel
      .find({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate('userId', 'name surname')
      .exec();
  }
  
  async searchRecipes(searchDto: SearchRecipeDto, userId?: string): Promise<Recipe[]> {
    console.log('Search DTO received:', JSON.stringify(searchDto));
    
    const query: any = {};
    
    // Base visibility condition
    if (searchDto.onlyPublic) {
      query.isPublic = true;
    } else if (userId) {
      // If user is logged in, show their private recipes + all public recipes
      query.$or = [
        { userId },
        { isPublic: true }
      ];
    } else {
      // Default to only public recipes if no user
      query.isPublic = true;
    }
    
    // Text search for name or instructions
    if (searchDto.query && searchDto.query.trim() !== '') {
      const regex = new RegExp(searchDto.query, 'i');
      // If we already have $or conditions for visibility
      if (query.$or) {
        // We need to use $and to combine our $or conditions
        query.$and = [
          { $or: query.$or },
          { $or: [{ name: regex }, { instructions: regex }] }
        ];
        // Remove the original $or since it's now in $and
        delete query.$or;
      } else {
        query.$or = [{ name: regex }, { instructions: regex }];
      }
    }
    
    // Search by ingredients
    if (searchDto.ingredients && searchDto.ingredients.length > 0) {
      // Match recipes containing ALL specified ingredients
      query.ingredients = { $all: searchDto.ingredients.map(i => new RegExp(i, 'i')) };
    }
    
    // Filter by dietary tags
    if (searchDto.dietaryTags && searchDto.dietaryTags.length > 0) {
      query.dietaryTags = { $all: searchDto.dietaryTags };
    }
    
    // Time filters
    if (searchDto.maxPrepTime) {
      query.prepTime = { $lte: parseInt(searchDto.maxPrepTime.toString()) };
    }
    
    if (searchDto.maxCookTime) {
      query.cookTime = { $lte: parseInt(searchDto.maxCookTime.toString()) };
    }
    
    if (searchDto.maxTotalTime) {
      query.$expr = { 
        $lte: [{ $add: ['$prepTime', '$cookTime'] }, parseInt(searchDto.maxTotalTime.toString())] 
      };
    }
    
    // Difficulty filter
    if (searchDto.difficulty) {
      query.difficulty = parseInt(searchDto.difficulty.toString());
    }
    
    // Meal type filter
    if (searchDto.mealType && searchDto.mealType.length > 0) {
      query.mealType = { $in: searchDto.mealType };
    }
    
    // Cuisine filter
    if (searchDto.cuisine && searchDto.cuisine.length > 0) {
      query.cuisine = { $in: searchDto.cuisine };
    }
    
    console.log('MongoDB query:', JSON.stringify(query));
    
    return this.recipeModel
      .find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name surname')
      .exec();
  }
  
  async getRecommendedRecipes(userId: string): Promise<Recipe[]> {
    // Get user's liked recipes to understand preferences
    const userLikedRecipes = await this.recipeModel
      .find({ likedBy: userId })
      .exec();
      
    if (userLikedRecipes.length === 0) {
      // If user hasn't liked any recipes, return popular recipes
      return this.recipeModel
        .find({ isPublic: true })
        .sort({ likesCount: -1 })
        .limit(10)
        .populate('userId', 'name surname')
        .exec();
    }
    
    // Extract preferences
    const preferredIngredients = new Set<string>();
    const preferredTags = new Set<string>();
    const preferredMealTypes = new Set<string>();
    const preferredCuisines = new Set<string>();
    
    userLikedRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => preferredIngredients.add(ingredient));
      recipe.dietaryTags?.forEach(tag => preferredTags.add(tag));
      recipe.mealType?.forEach(type => preferredMealTypes.add(type));
      recipe.cuisine?.forEach(cuisine => preferredCuisines.add(cuisine));
    });
    
    // Find recipes matching user preferences, excluding already liked recipes
    const likedIds = userLikedRecipes.map(recipe => recipe._id);
    
    const query: any = {
      isPublic: true,
      _id: { $nin: likedIds },
      $or: [
        // Match recipes with similar ingredients
        { ingredients: { $in: Array.from(preferredIngredients) } },
        // Match recipes with similar dietary tags
        { dietaryTags: { $in: Array.from(preferredTags) } },
        // Match recipes with similar meal types
        { mealType: { $in: Array.from(preferredMealTypes) } },
        // Match recipes with similar cuisines
        { cuisine: { $in: Array.from(preferredCuisines) } }
      ]
    };
    
    return this.recipeModel
      .find(query)
      .sort({ likesCount: -1 })
      .limit(10)
      .populate('userId', 'name surname')
      .exec();
  }

  async findUserRecipes(userId: string): Promise<Recipe[]> {
    return this.recipeModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Recipe> {
    const recipe = await this.recipeModel
      .findById(id)
      .populate('userId', 'name surname')
      .populate('comments.userId', 'name surname')
      .exec();
      
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    
    const recipeUserId = recipe.userId.toString();
    
    // Only allow access if the recipe is public or belongs to the requesting user
    if (!recipe.isPublic && recipeUserId !== userId) {
      throw new ForbiddenException('You do not have permission to view this recipe');
    }
    
    return recipe;
  }

  async update(
    id: string, 
    updateRecipeDto: UpdateRecipeDto, 
    userId: string
  ): Promise<Recipe> {
    const recipe = await this.recipeModel.findById(id).exec();
    
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    
    // Convert both IDs to strings and ensure they're both formatted the same way
    const recipeUserId = recipe.userId.toString();
    const requestUserId = userId.toString();
    
    console.log(`Recipe user ID: ${recipeUserId}`);
    console.log(`Request user ID: ${requestUserId}`);
    
    if (recipeUserId !== requestUserId) {
      throw new ForbiddenException('You do not have permission to update this recipe');
    }
    
    const updatedRecipe = await this.recipeModel
      .findByIdAndUpdate(id, updateRecipeDto, { new: true })
      .exec();
      
    return updatedRecipe;
  }

  async remove(id: string, userId: string): Promise<void> {
    const recipe = await this.recipeModel.findById(id).exec();
    
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    
    // Convert both IDs to strings for proper comparison
    const recipeUserId = recipe.userId.toString();
    const requestUserId = userId.toString();
    
    if (recipeUserId !== requestUserId) {
      throw new ForbiddenException('You do not have permission to delete this recipe');
    }
    
    const result = await this.recipeModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
  }

  async toggleLike(recipeId: string, userId: string): Promise<Recipe> {
    const recipe = await this.recipeModel.findById(recipeId).exec();
    
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${recipeId} not found`);
    }

    const userLikedIndex = recipe.likedBy.findIndex(
      id => id.toString() === userId,
    );

    if (userLikedIndex === -1) {
      // User hasn't liked the recipe yet, add like
      recipe.likedBy.push(userId as any);
      recipe.likesCount = recipe.likedBy.length;
    } else {
      // User already liked the recipe, remove like
      recipe.likedBy.splice(userLikedIndex, 1);
      recipe.likesCount = recipe.likedBy.length;
    }

    return recipe.save();
  }

  async addComment(
    recipeId: string, 
    userId: string, 
    createCommentDto: CreateCommentDto
  ): Promise<Recipe> {
    const recipe = await this.recipeModel.findById(recipeId).exec();
    
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${recipeId} not found`);
    }

    const comment = {
      userId,
      text: createCommentDto.text,
      createdAt: new Date(),
    };

    recipe.comments.push(comment as any);
    return recipe.save();
  }

  async getComments(recipeId: string, userId: string): Promise<any[]> {
    const recipe = await this.recipeModel
      .findById(recipeId)
      .populate('comments.userId', 'name surname')
      .exec();
      
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${recipeId} not found`);
    }
    
    const recipeUserId = recipe.userId.toString();
    
    // Only allow access if the recipe is public or belongs to the requesting user
    if (!recipe.isPublic && recipeUserId !== userId) {
      throw new ForbiddenException('You do not have permission to view comments for this recipe');
    }
    
    return recipe.comments;
  }
}