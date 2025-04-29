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
exports.UserRecipesController = exports.RecipesController = void 0;
const common_1 = require("@nestjs/common");
const recipes_service_1 = require("./recipes.service");
const create_recipe_dto_1 = require("./dto/create-recipe.dto");
const update_recipe_dto_1 = require("./dto/update-recipe.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const comment_dto_1 = require("./dto/comment.dto");
const search_recipe_dto_1 = require("./dto/search-recipe.dto");
let RecipesController = class RecipesController {
    constructor(recipesService) {
        this.recipesService = recipesService;
    }
    create(createRecipeDto, user) {
        return this.recipesService.create(createRecipeDto, user.id);
    }
    findAll(user) {
        return this.recipesService.findAll(user.id);
    }
    findAllPublic() {
        return this.recipesService.findAllPublic();
    }
    async searchRecipesGet(searchDto, user) {
        const userId = (user === null || user === void 0 ? void 0 : user.id) || null;
        return this.recipesService.searchRecipes(searchDto, userId);
    }
    async searchRecipes(searchDto, user) {
        const userId = (user === null || user === void 0 ? void 0 : user.id) || null;
        return this.recipesService.searchRecipes(searchDto, userId);
    }
    async getRecommendedRecipes(user) {
        return this.recipesService.getRecommendedRecipes(user.id);
    }
    findOne(id, user) {
        return this.recipesService.findOne(id, user.id);
    }
    update(id, updateRecipeDto, user) {
        return this.recipesService.update(id, updateRecipeDto, user.id);
    }
    remove(id, user) {
        return this.recipesService.remove(id, user.id);
    }
    toggleLike(id, user) {
        return this.recipesService.toggleLike(id, user.id);
    }
    addComment(id, user, createCommentDto) {
        return this.recipesService.addComment(id, user.id, createCommentDto);
    }
    getComments(id, user) {
        return this.recipesService.getComments(id, user.id);
    }
};
exports.RecipesController = RecipesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_recipe_dto_1.CreateRecipeDto, Object]),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "findAllPublic", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_recipe_dto_1.SearchRecipeDto, Object]),
    __metadata("design:returntype", Promise)
], RecipesController.prototype, "searchRecipesGet", null);
__decorate([
    (0, common_1.Post)('search'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_recipe_dto_1.SearchRecipeDto, Object]),
    __metadata("design:returntype", Promise)
], RecipesController.prototype, "searchRecipes", null);
__decorate([
    (0, common_1.Get)('recommended'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecipesController.prototype, "getRecommendedRecipes", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_recipe_dto_1.UpdateRecipeDto, Object]),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/like'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "toggleLike", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)(':id/comments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "getComments", null);
exports.RecipesController = RecipesController = __decorate([
    (0, common_1.Controller)('recipes'),
    __metadata("design:paramtypes", [recipes_service_1.RecipesService])
], RecipesController);
let UserRecipesController = class UserRecipesController {
    constructor(recipesService) {
        this.recipesService = recipesService;
    }
    findUserRecipes(user) {
        return this.recipesService.findUserRecipes(user.id);
    }
    createUserRecipe(createRecipeDto, user) {
        return this.recipesService.create(createRecipeDto, user.id);
    }
    updateUserRecipe(id, updateRecipeDto, user) {
        return this.recipesService.update(id, updateRecipeDto, user.id);
    }
    removeUserRecipe(id, user) {
        return this.recipesService.remove(id, user.id);
    }
};
exports.UserRecipesController = UserRecipesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserRecipesController.prototype, "findUserRecipes", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_recipe_dto_1.CreateRecipeDto, Object]),
    __metadata("design:returntype", void 0)
], UserRecipesController.prototype, "createUserRecipe", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_recipe_dto_1.UpdateRecipeDto, Object]),
    __metadata("design:returntype", void 0)
], UserRecipesController.prototype, "updateUserRecipe", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserRecipesController.prototype, "removeUserRecipe", null);
exports.UserRecipesController = UserRecipesController = __decorate([
    (0, common_1.Controller)('users/me/recipes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [recipes_service_1.RecipesService])
], UserRecipesController);
//# sourceMappingURL=recipes.controller.js.map