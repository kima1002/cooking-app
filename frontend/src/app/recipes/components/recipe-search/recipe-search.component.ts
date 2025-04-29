import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { RecipeService } from '../../services/recipe.service';
import { Recipe, SearchRecipeParams } from '../../models/recipe.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.scss']
})
export class RecipeSearchComponent implements OnInit {
  searchForm: FormGroup;
  searchResults: Recipe[] = [];
  recommendedRecipes: Recipe[] = [];
  isLoading = false;
  isLoadingRecommended = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  
  // Predefined dietary options
  dietaryOptions = [
    { value: 'vegetarian', displayName: 'Vegetarian' },
    { value: 'vegan', displayName: 'Vegan' },
    { value: 'gluten-free', displayName: 'Gluten-Free' },
    { value: 'dairy-free', displayName: 'Dairy-Free' },
    { value: 'low-carb', displayName: 'Low-Carb' },
    { value: 'keto', displayName: 'Keto' },
    { value: 'paleo', displayName: 'Paleo' },
  ];
  
  // Meal types
  mealTypeOptions = [
    { value: 'breakfast', displayName: 'Breakfast' },
    { value: 'lunch', displayName: 'Lunch' },
    { value: 'dinner', displayName: 'Dinner' },
    { value: 'dessert', displayName: 'Dessert' },
    { value: 'snack', displayName: 'Snack' },
    { value: 'appetizer', displayName: 'Appetizer' },
  ];
  
  // Cuisine types
  cuisineOptions = [
    { value: 'italian', displayName: 'Italian' },
    { value: 'mexican', displayName: 'Mexican' },
    { value: 'asian', displayName: 'Asian' },
    { value: 'indian', displayName: 'Indian' },
    { value: 'mediterranean', displayName: 'Mediterranean' },
    { value: 'american', displayName: 'American' },
    { value: 'french', displayName: 'French' },
  ];
  
  // Difficulty levels
  difficultyOptions = [
    { value: 1, displayName: 'Easy' },
    { value: 2, displayName: 'Medium' },
    { value: 3, displayName: 'Hard' },
  ];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      ingredients: this.fb.array([]),
      dietaryTags: this.fb.array([]),
      maxPrepTime: [null],
      maxCookTime: [null],
      maxTotalTime: [null],
      difficulty: [null],
      mealType: this.fb.array([]),
      cuisine: this.fb.array([]),
      onlyPublic: [true]
    });
  }

  ngOnInit(): void {
    this.loadRecommendedRecipes();
  }
  
  get ingredientsArray() {
    return this.searchForm.get('ingredients') as FormArray;
  }
  
  addIngredient(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.ingredientsArray.push(this.fb.control(value));
    }
    event.chipInput!.clear();
  }
  
  removeIngredient(index: number): void {
    this.ingredientsArray.removeAt(index);
  }
  
  onDietaryTagChange(tag: string, isChecked: boolean): void {
    const dietaryTags = this.searchForm.get('dietaryTags') as FormArray;
    
    if (isChecked) {
      dietaryTags.push(new FormControl(tag));
    } else {
      const index = dietaryTags.controls.findIndex(control => control.value === tag);
      if (index >= 0) {
        dietaryTags.removeAt(index);
      }
    }
  }
  
  onMealTypeChange(type: string, isChecked: boolean): void {
    const mealTypes = this.searchForm.get('mealType') as FormArray;
    
    if (isChecked) {
      mealTypes.push(new FormControl(type));
    } else {
      const index = mealTypes.controls.findIndex(control => control.value === type);
      if (index >= 0) {
        mealTypes.removeAt(index);
      }
    }
  }
  
  onCuisineChange(cuisine: string, isChecked: boolean): void {
    const cuisines = this.searchForm.get('cuisine') as FormArray;
    
    if (isChecked) {
      cuisines.push(new FormControl(cuisine));
    } else {
      const index = cuisines.controls.findIndex(control => control.value === cuisine);
      if (index >= 0) {
        cuisines.removeAt(index);
      }
    }
  }
  
  onSearch(): void {
    this.isLoading = true;
    const searchParams: SearchRecipeParams = this.searchForm.value;
    
    // Convert FormArray values to regular arrays for better API serialization
    searchParams.ingredients = this.ingredientsArray.value || [];
    searchParams.dietaryTags = (this.searchForm.get('dietaryTags') as FormArray).value || [];
    searchParams.mealType = (this.searchForm.get('mealType') as FormArray).value || [];
    searchParams.cuisine = (this.searchForm.get('cuisine') as FormArray).value || [];
    
    console.log('Sending search params:', searchParams);
    
    this.recipeService.searchRecipes(searchParams).subscribe({
      next: (results) => {
        console.log('Search results received:', results);
        this.searchResults = results;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to search recipes', 'Close', { duration: 3000 });
        console.error('Error searching recipes', error);
      }
    });
  }
  
  clearSearch(): void {
    this.searchForm.reset({
      query: '',
      maxPrepTime: null,
      maxCookTime: null,
      maxTotalTime: null,
      difficulty: null,
      onlyPublic: true
    });
    
    // Clear arrays
    (this.searchForm.get('ingredients') as FormArray).clear();
    (this.searchForm.get('dietaryTags') as FormArray).clear();
    (this.searchForm.get('mealType') as FormArray).clear();
    (this.searchForm.get('cuisine') as FormArray).clear();
    
    this.searchResults = [];
  }
  
  loadRecommendedRecipes(): void {
    this.isLoadingRecommended = true;
    
    this.recipeService.getRecommendedRecipes().subscribe({
      next: (recipes) => {
        this.recommendedRecipes = recipes;
        this.isLoadingRecommended = false;
      },
      error: (error) => {
        this.isLoadingRecommended = false;
        // Silently fail, recommendations are not critical
        console.error('Error loading recommendations', error);
      }
    });
  }
  
  isDietaryTagSelected(tag: string): boolean {
    const dietaryTags = this.searchForm.get('dietaryTags') as FormArray;
    return dietaryTags.controls.some(control => control.value === tag);
  }
  
  isMealTypeSelected(type: string): boolean {
    const mealTypes = this.searchForm.get('mealType') as FormArray;
    return mealTypes.controls.some(control => control.value === type);
  }
  
  isCuisineSelected(cuisine: string): boolean {
    const cuisines = this.searchForm.get('cuisine') as FormArray;
    return cuisines.controls.some(control => control.value === cuisine);
  }
}