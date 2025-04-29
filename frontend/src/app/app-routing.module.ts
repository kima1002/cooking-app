import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Recipe components
import { RecipeListComponent } from './recipes/components/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/components/recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from './recipes/components/recipe-form/recipe-form.component';
import { MyRecipesComponent } from './recipes/components/my-recipes/my-recipes.component';
import { PublicRecipesComponent } from './recipes/components/public-recipes/public-recipes.component';
import { RecipeSearchComponent } from './recipes/components/recipe-search/recipe-search.component';

// Auth components
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ProfileComponent } from './auth/components/profile/profile.component';

// Guards
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  
  // Recipe routes
  { path: 'recipes', component: RecipeListComponent },
  { path: 'recipes/public', component: PublicRecipesComponent },
  { path: 'recipes/new', component: RecipeFormComponent, canActivate: [AuthGuard] },
  { path: 'recipes/search', component: RecipeSearchComponent },
  { path: 'recipes/:id', component: RecipeDetailComponent },
  { path: 'recipes/:id/edit', component: RecipeFormComponent, canActivate: [AuthGuard] },
  
  // User recipe routes
  { path: 'my-recipes', component: MyRecipesComponent, canActivate: [AuthGuard] },
  
  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  
  // Fallback route
  { path: '**', redirectTo: '/recipes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }