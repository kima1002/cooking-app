import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Recipe } from '../../../recipes/models/recipe.model';

@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.scss']
})
export class LikeButtonComponent implements OnInit {
  @Input() recipe!: Recipe;
  @Output() liked = new EventEmitter<void>();
  
  isLiked = false;
  userId: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userId = user._id ?? null;
        this.updateLikedStatus();
      }
    });
  }

  ngOnChanges(): void {
    this.updateLikedStatus();
  }

  updateLikedStatus(): void {
    if (this.userId && this.recipe && this.recipe.likedBy) {
      this.isLiked = this.recipe.likedBy.some(id => {
        if (typeof id === 'string') {
          return id === this.userId;
        } else if (typeof id === 'object' && id._id) {
          return id._id === this.userId;
        }
        return false;
      });
    } else {
      this.isLiked = false;
    }
  }

  toggleLike(): void {
    if (!this.userId) {
      return;
    }
    // Toggle like state locally before emitting to prevent multiple clicks
    this.isLiked = !this.isLiked;
    // Update UI immediately
    if (this.isLiked) {
      this.recipe.likesCount++;
    } else {
      this.recipe.likesCount--;
    }
    
    this.liked.emit();
  }
}