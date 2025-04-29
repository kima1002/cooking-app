import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  isEditMode = false;
  recipeId: string | null = null;
  isLoading = false;
  isSubmitting = false;
  isDialog = false;
  
  // For the chips input
  separatorKeysCodes = [ENTER, COMMA];
  dietaryTags: string[] = [];
  mealTypes: string[] = [];
  cuisines: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private snackBar: MatSnackBar,
    @Optional() private dialogRef: MatDialogRef<RecipeFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: { recipe?: Recipe }
  ) {
    this.recipeForm = this.createForm();
    this.isDialog = !!this.dialogRef;
  }

  ngOnInit(): void {
    if (this.isDialog && this.dialogData?.recipe) {
      this.isEditMode = true;
      this.recipeId = this.dialogData.recipe._id || null;
      this.populateForm(this.dialogData.recipe);
    } else {
      this.recipeId = this.route.snapshot.paramMap.get('id');
      this.isEditMode = !!this.recipeId;

      if (this.isEditMode && this.recipeId) {
        this.loadRecipe(this.recipeId);
      }
    }
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      ingredients: this.fb.array([this.createIngredient()], Validators.required),
      instructions: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: ['', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')],
      isPublic: [false],
      // Advanced search fields
      prepTime: [0],
      cookTime: [0],
      difficulty: [null],
      dietaryTags: [[]],
      mealType: [[]],
      cuisine: [[]]
    });
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      value: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number): void {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  loadRecipe(id: string): void {
    this.isLoading = true;
    this.recipeService.getRecipe(id).subscribe({
      next: (recipe) => {
        this.populateForm(recipe);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load recipe', 'Close', { duration: 3000 });
        console.error('Error loading recipe', error);
        if (!this.isDialog) {
          this.router.navigate(['/recipes']);
        }
      }
    });
  }

  populateForm(recipe: Recipe): void {
    // Clear existing ingredients
    while (this.ingredients.length) {
      this.ingredients.removeAt(0);
    }

    // Add all ingredients from the recipe
    recipe.ingredients.forEach(ingredient => {
      this.ingredients.push(this.fb.group({
        value: [ingredient, [Validators.required, Validators.minLength(2)]]
      }));
    });
    
    // Set the tags for chip lists
    this.dietaryTags = recipe.dietaryTags || [];
    this.mealTypes = recipe.mealType || [];
    this.cuisines = recipe.cuisine || [];

    this.recipeForm.patchValue({
      name: recipe.name,
      instructions: recipe.instructions,
      imageUrl: recipe.imageUrl || '',
      isPublic: recipe.isPublic,
      // Advanced search fields
      prepTime: recipe.prepTime || 0,
      cookTime: recipe.cookTime || 0,
      difficulty: recipe.difficulty || null,
      dietaryTags: recipe.dietaryTags || [],
      mealType: recipe.mealType || [],
      cuisine: recipe.cuisine || []
    });
  }

  // Chip input methods
  addDietaryTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.dietaryTags.push(value.toLowerCase());
      this.recipeForm.get('dietaryTags')?.setValue(this.dietaryTags);
    }
    event.chipInput!.clear();
  }
  
  removeTag(tag: string): void {
    const index = this.dietaryTags.indexOf(tag);
    if (index >= 0) {
      this.dietaryTags.splice(index, 1);
      this.recipeForm.get('dietaryTags')?.setValue(this.dietaryTags);
    }
  }
  
  addMealType(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.mealTypes.push(value.toLowerCase());
      this.recipeForm.get('mealType')?.setValue(this.mealTypes);
    }
    event.chipInput!.clear();
  }
  
  removeMealType(type: string): void {
    const index = this.mealTypes.indexOf(type);
    if (index >= 0) {
      this.mealTypes.splice(index, 1);
      this.recipeForm.get('mealType')?.setValue(this.mealTypes);
    }
  }
  
  addCuisine(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.cuisines.push(value.toLowerCase());
      this.recipeForm.get('cuisine')?.setValue(this.cuisines);
    }
    event.chipInput!.clear();
  }
  
  removeCuisine(cuisine: string): void {
    const index = this.cuisines.indexOf(cuisine);
    if (index >= 0) {
      this.cuisines.splice(index, 1);
      this.recipeForm.get('cuisine')?.setValue(this.cuisines);
    }
  }

  onSubmit(): void {
    if (this.recipeForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.recipeForm.markAllAsTouched();
      return;
    }

    const formValue = this.recipeForm.value;
    
    // Extract ingredient values from the form array
    const ingredientValues = formValue.ingredients.map((i: { value: string }) => i.value);
    
    const recipe: Omit<Recipe, '_id'> = {
      name: formValue.name,
      ingredients: ingredientValues,
      instructions: formValue.instructions,
      imageUrl: formValue.imageUrl || undefined,
      isPublic: formValue.isPublic,
      userId: '',
      likesCount: 0,
      likedBy: [],
      comments: [],
      // Advanced search fields
      prepTime: formValue.prepTime || 0,
      cookTime: formValue.cookTime || 0,
      dietaryTags: this.dietaryTags,
      difficulty: formValue.difficulty,
      mealType: this.mealTypes,
      cuisine: this.cuisines
    };

    this.isSubmitting = true;

    if (this.isEditMode && this.recipeId) {
      const updateFunction = this.isDialog 
        ? this.recipeService.updateUserRecipe(this.recipeId, recipe)
        : this.recipeService.updateRecipe(this.recipeId, recipe);
        
      updateFunction.subscribe({
        next: (updatedRecipe) => {
          this.isSubmitting = false;
          this.snackBar.open('Recipe updated successfully', 'Close', { duration: 3000 });
          
          if (this.isDialog) {
            this.dialogRef.close(true);
          } else {
            this.router.navigate(['/recipes', updatedRecipe._id]);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Failed to update recipe', 'Close', { duration: 3000 });
          console.error('Error updating recipe', error);
        }
      });
    } else {
      const createFunction = this.isDialog 
        ? this.recipeService.createUserRecipe(recipe)
        : this.recipeService.createRecipe(recipe);
        
      createFunction.subscribe({
        next: (newRecipe) => {
          this.isSubmitting = false;
          this.snackBar.open('Recipe created successfully', 'Close', { duration: 3000 });
          
          if (this.isDialog) {
            this.dialogRef.close(true);
          } else {
            this.router.navigate(['/recipes', newRecipe._id]);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open('Failed to create recipe', 'Close', { duration: 3000 });
          console.error('Error creating recipe', error);
        }
      });
    }
  }

  onCancel(): void {
    if (this.isDialog) {
      this.dialogRef.close(false);
    } else {
      this.router.navigate(['/recipes']);
    }
  }
}