import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment, Recipe } from '../../../recipes/models/recipe.model';
import { RecipeService } from '../../../recipes/services/recipe.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comments-section',
  templateUrl: './comments-section.component.html',
  styleUrls: ['./comments-section.component.scss']
})
export class CommentsSectionComponent implements OnInit {
  @Input() recipeId!: string;
  
  comments: Comment[] = [];
  commentForm: FormGroup;
  isLoading = false;
  isSubmitting = false;
  isLoggedIn = false;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadComments();
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  loadComments(): void {
    if (!this.recipeId) return;
    
    this.isLoading = true;
    this.recipeService.getComments(this.recipeId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load comments', 'Close', { duration: 3000 });
      }
    });
  }

  submitComment(): void {
    if (this.commentForm.invalid || !this.recipeId) {
      return;
    }

    const { text } = this.commentForm.value;
    this.isSubmitting = true;

    this.recipeService.addComment(this.recipeId, text).subscribe({
      next: () => {
        this.commentForm.reset();
        this.loadComments();
        this.isSubmitting = false;
      },
      error: () => {
        this.isSubmitting = false;
        this.snackBar.open('Failed to add comment', 'Close', { duration: 3000 });
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  getUserName(comment: Comment): string {
    if (typeof comment.userId === 'string') {
      return 'User';
    } else {
      return `${comment.userId.name} ${comment.userId.surname || ''}`.trim();
    }
  }
}