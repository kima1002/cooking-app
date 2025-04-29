import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/models/user.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  isLoading = false;
  currentUser: User | null = null;

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.isLoading = true;
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load recipes', 'Close', { duration: 3000 });
        console.error('Error loading recipes', error);
      }
    });
  }

  deleteRecipe(id: string): void {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(id).subscribe({
        next: () => {
          this.recipes = this.recipes.filter(recipe => recipe._id !== id);
          this.snackBar.open('Recipe deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Failed to delete recipe', 'Close', { duration: 3000 });
          console.error('Error deleting recipe', error);
        }
      });
    }
  }

  isRecipeOwner(recipe: Recipe): boolean {
    if (!this.currentUser || !recipe) return false;
    
    if (typeof recipe.userId === 'string') {
      return recipe.userId === this.currentUser._id;
    } else if (typeof recipe.userId === 'object' && recipe.userId._id) {
      return recipe.userId._id === this.currentUser._id;
    }
    
    return false;
  }
  
  getRecipeAuthor(recipe: Recipe): string {
    if (!recipe) return '';
    
    if (typeof recipe.userId === 'string') {
      return 'User';
    } else {
      return `${recipe.userId.name} ${recipe.userId.surname || ''}`.trim();
    }
  }
  
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
    const cardElement = imgElement.closest('.recipe-card');
    if (cardElement) {
      const placeholderDiv = document.createElement('div');
      placeholderDiv.className = 'placeholder-image';
      
      // Create and add the material icon
      const iconElement = document.createElement('mat-icon');
      iconElement.textContent = 'restaurant';
      placeholderDiv.appendChild(iconElement);
      
      // Insert the placeholder after the image
      imgElement.parentNode?.insertBefore(placeholderDiv, imgElement.nextSibling);
    }
  }
}
