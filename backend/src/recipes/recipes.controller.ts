import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpStatus, 
  HttpCode,
  UseGuards,
  Query
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateCommentDto } from './dto/comment.dto';
import { SearchRecipeDto } from './dto/search-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createRecipeDto: CreateRecipeDto,
    @GetUser() user,
  ) {
    return this.recipesService.create(createRecipeDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@GetUser() user) {
    return this.recipesService.findAll(user.id);
  }

  @Get('public')
  findAllPublic() {
    return this.recipesService.findAllPublic();
  }
  
  @Get('search')
  async searchRecipesGet(@Query() searchDto: SearchRecipeDto, @GetUser() user?) {
    const userId = user?.id || null;
    return this.recipesService.searchRecipes(searchDto, userId);
  }
  
  @Post('search')
  async searchRecipes(@Body() searchDto: SearchRecipeDto, @GetUser() user?) {
    const userId = user?.id || null;
    return this.recipesService.searchRecipes(searchDto, userId);
  }
  
  @Get('recommended')
  @UseGuards(JwtAuthGuard)
  async getRecommendedRecipes(@GetUser() user) {
    return this.recipesService.getRecommendedRecipes(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @GetUser() user) {
    return this.recipesService.findOne(id, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string, 
    @Body() updateRecipeDto: UpdateRecipeDto,
    @GetUser() user,
  ) {
    return this.recipesService.update(id, updateRecipeDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @GetUser() user,
  ) {
    return this.recipesService.remove(id, user.id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  toggleLike(
    @Param('id') id: string,
    @GetUser() user,
  ) {
    return this.recipesService.toggleLike(id, user.id);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  addComment(
    @Param('id') id: string,
    @GetUser() user,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.recipesService.addComment(id, user.id, createCommentDto);
  }

  @Get(':id/comments')
  @UseGuards(JwtAuthGuard)
  getComments(@Param('id') id: string, @GetUser() user) {
    return this.recipesService.getComments(id, user.id);
  }
}

@Controller('users/me/recipes')
@UseGuards(JwtAuthGuard)
export class UserRecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  findUserRecipes(@GetUser() user) {
    return this.recipesService.findUserRecipes(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createUserRecipe(
    @Body() createRecipeDto: CreateRecipeDto,
    @GetUser() user,
  ) {
    return this.recipesService.create(createRecipeDto, user.id);
  }

  @Patch(':id')
  updateUserRecipe(
    @Param('id') id: string, 
    @Body() updateRecipeDto: UpdateRecipeDto,
    @GetUser() user,
  ) {
    return this.recipesService.update(id, updateRecipeDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeUserRecipe(
    @Param('id') id: string,
    @GetUser() user,
  ) {
    return this.recipesService.remove(id, user.id);
  }
}