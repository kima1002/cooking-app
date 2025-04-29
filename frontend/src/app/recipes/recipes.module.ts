import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

// Material imports
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';

// Components
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { MyRecipesComponent } from './components/my-recipes/my-recipes.component';
import { PublicRecipesComponent } from './components/public-recipes/public-recipes.component';
import { RecipeSearchComponent } from './components/recipe-search/recipe-search.component';
import { RecipeCardComponent } from './components/recipe-card/recipe-card.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatList, MatListItem } from '@angular/material/list';

@NgModule({
  declarations: [
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeFormComponent,
    MyRecipesComponent,
    PublicRecipesComponent,
    RecipeSearchComponent,
    RecipeCardComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        SharedModule,
        RouterModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatDialogModule,
        MatChipsModule,
        MatTabsModule,
        MatSnackBarModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatProgressBar,
        MatListItem,
        MatList,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatCardModule
    ],
  exports: [
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeFormComponent,
    MyRecipesComponent,
    PublicRecipesComponent,
    RecipeSearchComponent,
    RecipeCardComponent
  ]
})
export class RecipesModule { }
