import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../models/recipe.model';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/models/user.model';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent implements OnInit {
  @Input() recipe!: Recipe;
  
  currentUser: User | null = null;
  isOwner = false;
  
  constructor(
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.checkOwnership();
    });
  }
  
  ngOnChanges(): void {
    this.checkOwnership();
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
  
  getRecipeAuthor(): string {
    if (!this.recipe) return '';
    
    if (typeof this.recipe.userId === 'string') {
      return 'User';
    } else {
      return `${this.recipe.userId.name} ${this.recipe.userId.surname || ''}`.trim();
    }
  }
  
  getTotalTime(): string {
    const prepTime = this.recipe.prepTime || 0;
    const cookTime = this.recipe.cookTime || 0;
    const totalTime = prepTime + cookTime;
    
    if (totalTime === 0) {
      return 'Time not specified';
    }
    
    if (totalTime < 60) {
      return `${totalTime} min`;
    }
    
    const hours = Math.floor(totalTime / 60);
    const mins = totalTime % 60;
    
    if (mins === 0) {
      return `${hours} hr`;
    }
    
    return `${hours} hr ${mins} min`;
  }
  
  getDifficultyLabel(): string {
    switch(this.recipe.difficulty) {
      case 1:
        return 'Easy';
      case 2:
        return 'Medium';
      case 3:
        return 'Hard';
      default:
        return '';
    }
  }
  
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }
}