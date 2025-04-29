import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.scss']
})
export class MyRecipesComponent implements OnInit {
  recipes: Recipe[] = [];
  isLoading = false;

  constructor(
    private recipeService: RecipeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserRecipes();
  }

  loadUserRecipes(): void {
    this.isLoading = true;
    this.recipeService.getUserRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load your recipes', 'Close', { duration: 3000 });
      }
    });
  }

  openRecipeForm(recipe?: Recipe): void {
    const dialogRef = this.dialog.open(RecipeFormComponent, {
      width: '1000px',
      data: { recipe }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUserRecipes();
      }
    });
  }

  togglePublic(recipe: Recipe): void {
    const updatedRecipe = { ...recipe, isPublic: !recipe.isPublic };

    if (!recipe._id) {
      this.snackBar.open('Recipe ID is missing', 'Close', { duration: 3000 });
      return;
    }

    // Ensure ID is a string
    const recipeId = recipe._id.toString();

    this.recipeService.updateUserRecipe(recipeId, { isPublic: !recipe.isPublic }).subscribe({
      next: () => {
        this.snackBar.open(
          `Recipe is now ${updatedRecipe.isPublic ? 'public' : 'private'}`,
          'Close',
          { duration: 3000 }
        );
        this.loadUserRecipes();
      },
      error: (error) => {
        console.error('Error updating recipe visibility:', error);
        this.snackBar.open(
          'Failed to update recipe visibility: ' + (error.error?.message || 'Unknown error'),
          'Close',
          { duration: 5000 }
        );
      }
    });
  }

  deleteRecipe(recipe: Recipe): void {
    if (confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      this.recipeService.deleteUserRecipe(recipe._id!).subscribe({
        next: () => {
          this.snackBar.open('Recipe deleted successfully', 'Close', { duration: 3000 });
          this.loadUserRecipes();
        },
        error: () => {
          this.snackBar.open('Failed to delete recipe', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
