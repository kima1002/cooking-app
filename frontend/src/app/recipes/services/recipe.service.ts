import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comment, Recipe, SearchRecipeParams } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = `${environment.apiUrl}/recipes`;
  private userRecipesUrl = `${environment.apiUrl}/users/me/recipes`;

  constructor(private http: HttpClient) {}

  // Public recipe endpoints
  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  getPublicRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/public`);
  }

  getRecipe(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  createRecipe(recipe: Omit<Recipe, '_id'>): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe);
  }

  updateRecipe(id: string, recipe: Partial<Recipe>): Observable<Recipe> {
    return this.http.patch<Recipe>(`${this.apiUrl}/${id}`, recipe);
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // User recipes endpoints
  getUserRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.userRecipesUrl);
  }

  createUserRecipe(recipe: Omit<Recipe, '_id'>): Observable<Recipe> {
    return this.http.post<Recipe>(this.userRecipesUrl, recipe);
  }

  updateUserRecipe(id: string, recipe: Partial<Recipe>): Observable<Recipe> {
    return this.http.patch<Recipe>(`${this.userRecipesUrl}/${id}`, recipe);
  }

  deleteUserRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.userRecipesUrl}/${id}`);
  }

  // Social interactions
  toggleLike(recipeId: string): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/${recipeId}/like`, {});
  }

  getComments(recipeId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${recipeId}/comments`);
  }

  addComment(recipeId: string, text: string): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/${recipeId}/comments`, { text });
  }
  
  // Advanced search and recommendation
  searchRecipes(params: SearchRecipeParams): Observable<Recipe[]> {
    // The issue might be related to how parameters are being sent as query params
    // Let's try sending the data as a POST request with the body instead
    return this.http.post<Recipe[]>(`${this.apiUrl}/search`, params);
  }
  
  getRecommendedRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recommended`);
  }
}