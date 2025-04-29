import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/models/user.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  isLoading = false;
  isLiking = false;
  currentUser: User | null = null;
  isOwner = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.checkOwnership();
    });
    
    this.loadRecipe();
  }

  loadRecipe(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.snackBar.open('Recipe ID not found', 'Close', { duration: 3000 });
      this.router.navigate(['/recipes']);
      return;
    }

    this.isLoading = true;
    this.recipeService.getRecipe(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.isLoading = false;
        this.checkOwnership();
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load recipe', 'Close', { duration: 3000 });
        console.error('Error loading recipe', error);
        this.router.navigate(['/recipes']);
      }
    });
  }

  checkOwnership(): void {
    if (!this.recipe || !this.currentUser) {
      this.isOwner = false;
      return;
    }
    
    if (typeof this.recipe.userId === 'string') {
      this.isOwner = this.recipe.userId === this.currentUser._id;
    } else if (typeof this.recipe.userId === 'object' && this.recipe.userId._id) {
      this.isOwner = this.recipe.userId._id === this.currentUser._id;
    }
  }

  handleLike(): void {
    if (!this.recipe?._id) return;
    
    // Disable multiple clicks while the request is in progress
    if (this.isLiking) return;
    this.isLiking = true;
    
    this.recipeService.toggleLike(this.recipe._id).subscribe({
      next: (updatedRecipe) => {
        this.recipe = updatedRecipe;
        this.isLiking = false;
      },
      error: () => {
        // If the request fails, reload the recipe to reset the like state
        this.loadRecipe();
        this.snackBar.open('Failed to update like', 'Close', { duration: 3000 });
        this.isLiking = false;
      }
    });
  }

  deleteRecipe(): void {
    if (!this.recipe?._id) return;

    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(this.recipe._id).subscribe({
        next: () => {
          this.snackBar.open('Recipe deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/recipes']);
        },
        error: (error) => {
          this.snackBar.open('Failed to delete recipe', 'Close', { duration: 3000 });
          console.error('Error deleting recipe', error);
        }
      });
    }
  }
  
  getAuthorName(): string {
    if (!this.recipe) return '';
    
    if (typeof this.recipe.userId === 'string') {
      return 'User';
    } else {
      return `${this.recipe.userId.name} ${this.recipe.userId.surname || ''}`.trim();
    }
  }
  
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
    
    if (this.recipe) {
      // Set the image URL to undefined so the placeholder shows up
      this.recipe.imageUrl = undefined;
    }
  }
}