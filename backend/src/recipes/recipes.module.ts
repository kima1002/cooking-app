import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipesService } from './recipes.service';
import { RecipesController, UserRecipesController } from './recipes.controller';
import { Recipe, RecipeSchema } from './recipe.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
  ],
  controllers: [RecipesController, UserRecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}