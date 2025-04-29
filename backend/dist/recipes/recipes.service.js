"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const recipe_schema_1 = require("./recipe.schema");
let RecipesService = class RecipesService {
    constructor(recipeModel) {
        this.recipeModel = recipeModel;
    }
    async create(createRecipeDto, userId) {
        const newRecipe = new this.recipeModel(Object.assign(Object.assign({}, createRecipeDto), { userId }));
        return newRecipe.save();
    }
    async findAll(userId) {
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
    async findAllPublic() {
        return this.recipeModel
            .find({ isPublic: true })
            .sort({ createdAt: -1 })
            .populate('userId', 'name surname')
            .exec();
    }
    async searchRecipes(searchDto, userId) {
        console.log('Search DTO received:', JSON.stringify(searchDto));
        const query = {};
        if (searchDto.onlyPublic) {
            query.isPublic = true;
        }
        else if (userId) {
            query.$or = [
                { userId },
                { isPublic: true }
            ];
        }
        else {
            query.isPublic = true;
        }
        if (searchDto.query && searchDto.query.trim() !== '') {
            const regex = new RegExp(searchDto.query, 'i');
            if (query.$or) {
                query.$and = [
                    { $or: query.$or },
                    { $or: [{ name: regex }, { instructions: regex }] }
                ];
                delete query.$or;
            }
            else {
                query.$or = [{ name: regex }, { instructions: regex }];
            }
        }
        if (searchDto.ingredients && searchDto.ingredients.length > 0) {
            query.ingredients = { $all: searchDto.ingredients.map(i => new RegExp(i, 'i')) };
        }
        if (searchDto.dietaryTags && searchDto.dietaryTags.length > 0) {
            query.dietaryTags = { $all: searchDto.dietaryTags };
        }
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
        if (searchDto.difficulty) {
            query.difficulty = parseInt(searchDto.difficulty.toString());
        }
        if (searchDto.mealType && searchDto.mealType.length > 0) {
            query.mealType = { $in: searchDto.mealType };
        }
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
    async getRecommendedRecipes(userId) {
        const userLikedRecipes = await this.recipeModel
            .find({ likedBy: userId })
            .exec();
        if (userLikedRecipes.length === 0) {
            return this.recipeModel
                .find({ isPublic: true })
                .sort({ likesCount: -1 })
                .limit(10)
                .populate('userId', 'name surname')
                .exec();
        }
        const preferredIngredients = new Set();
        const preferredTags = new Set();
        const preferredMealTypes = new Set();
        const preferredCuisines = new Set();
        userLikedRecipes.forEach(recipe => {
            var _a, _b, _c;
            recipe.ingredients.forEach(ingredient => preferredIngredients.add(ingredient));
            (_a = recipe.dietaryTags) === null || _a === void 0 ? void 0 : _a.forEach(tag => preferredTags.add(tag));
            (_b = recipe.mealType) === null || _b === void 0 ? void 0 : _b.forEach(type => preferredMealTypes.add(type));
            (_c = recipe.cuisine) === null || _c === void 0 ? void 0 : _c.forEach(cuisine => preferredCuisines.add(cuisine));
        });
        const likedIds = userLikedRecipes.map(recipe => recipe._id);
        const query = {
            isPublic: true,
            _id: { $nin: likedIds },
            $or: [
                { ingredients: { $in: Array.from(preferredIngredients) } },
                { dietaryTags: { $in: Array.from(preferredTags) } },
                { mealType: { $in: Array.from(preferredMealTypes) } },
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
    async findUserRecipes(userId) {
        return this.recipeModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id, userId) {
        const recipe = await this.recipeModel
            .findById(id)
            .populate('userId', 'name surname')
            .populate('comments.userId', 'name surname')
            .exec();
        if (!recipe) {
            throw new common_1.NotFoundException(`Recipe with ID ${id} not found`);
        }
        const recipeUserId = recipe.userId.toString();
        if (!recipe.isPublic && recipeUserId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to view this recipe');
        }
        return recipe;
    }
    async update(id, updateRecipeDto, userId) {
        const recipe = await this.recipeModel.findById(id).exec();
        if (!recipe) {
            throw new common_1.NotFoundException(`Recipe with ID ${id} not found`);
        }
        const recipeUserId = recipe.userId.toString();
        const requestUserId = userId.toString();
        console.log(`Recipe user ID: ${recipeUserId}`);
        console.log(`Request user ID: ${requestUserId}`);
        if (recipeUserId !== requestUserId) {
            throw new common_1.ForbiddenException('You do not have permission to update this recipe');
        }
        const updatedRecipe = await this.recipeModel
            .findByIdAndUpdate(id, updateRecipeDto, { new: true })
            .exec();
        return updatedRecipe;
    }
    async remove(id, userId) {
        const recipe = await this.recipeModel.findById(id).exec();
        if (!recipe) {
            throw new common_1.NotFoundException(`Recipe with ID ${id} not found`);
        }
        const recipeUserId = recipe.userId.toString();
        const requestUserId = userId.toString();
        if (recipeUserId !== requestUserId) {
            throw new common_1.ForbiddenException('You do not have permission to delete this recipe');
        }
        const result = await this.recipeModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Recipe with ID ${id} not found`);
        }
    }
    async toggleLike(recipeId, userId) {
        const recipe = await this.recipeModel.findById(recipeId).exec();
        if (!recipe) {
            throw new common_1.NotFoundException(`Recipe with ID ${recipeId} not found`);
        }
        const userLikedIndex = recipe.likedBy.findIndex(id => id.toString() === userId);
        if (userLikedIndex === -1) {
            recipe.likedBy.push(userId);
            recipe.likesCount = recipe.likedBy.length;
        }
        else {
            recipe.likedBy.splice(userLikedIndex, 1);
            recipe.likesCount = recipe.likedBy.length;
        }
        return recipe.save();
    }
    async addComment(recipeId, userId, createCommentDto) {
        const recipe = await this.recipeModel.findById(recipeId).exec();
        if (!recipe) {
            throw new common_1.NotFoundException(`Recipe with ID ${recipeId} not found`);
        }
        const comment = {
            userId,
            text: createCommentDto.text,
            createdAt: new Date(),
        };
        recipe.comments.push(comment);
        return recipe.save();
    }
    async getComments(recipeId, userId) {
        const recipe = await this.recipeModel
            .findById(recipeId)
            .populate('comments.userId', 'name surname')
            .exec();
        if (!recipe) {
            throw new common_1.NotFoundException(`Recipe with ID ${recipeId} not found`);
        }
        const recipeUserId = recipe.userId.toString();
        if (!recipe.isPublic && recipeUserId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to view comments for this recipe');
        }
        return recipe.comments;
    }
};
exports.RecipesService = RecipesService;
exports.RecipesService = RecipesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(recipe_schema_1.Recipe.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RecipesService);
//# sourceMappingURL=recipes.service.js.map