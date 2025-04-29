import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-public-recipes',
  templateUrl: './public-recipes.component.html',
  styleUrls: ['./public-recipes.component.scss']
})
export class PublicRecipesComponent implements OnInit {
  recipes: Recipe[] = [];
  isLoading = false;

  constructor(
    private recipeService: RecipeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPublicRecipes();
  }

  loadPublicRecipes(): void {
    this.isLoading = true;
    this.recipeService.getPublicRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load public recipes', 'Close', { duration: 3000 });
      }
    });
  }

  handleLike(recipe: Recipe): void {
    this.recipeService.toggleLike(recipe._id!).subscribe({
      next: (updatedRecipe) => {
        const index = this.recipes.findIndex(r => r._id === recipe._id);
        if (index !== -1) {
          this.recipes[index] = updatedRecipe;
        }
      },
      error: () => {
        this.snackBar.open('Failed to update like', 'Close', { duration: 3000 });
      }
    });
  }

  getAuthorName(recipe: Recipe): string {
    if (typeof recipe.userId === 'string') {
      return 'User';
    } else {
      return `${recipe.userId.name} ${recipe.userId.surname || ''}`.trim();
    }
  }
}