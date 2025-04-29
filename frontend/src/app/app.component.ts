import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { User } from './auth/models/user.model';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-toolbar">
        <div class="toolbar-left">
          <a mat-button routerLink="/" class="logo">
            <mat-icon>restaurant_menu</mat-icon>
            <span>CookEasy</span>
          </a>
          
          <a mat-button routerLink="/recipes" class="nav-link">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-button routerLink="/recipes/public" class="nav-link">
            <mat-icon>public</mat-icon>
            <span>Shared Recipes</span>
          </a>
          <a mat-button routerLink="/recipes/search" class="nav-link">
            <mat-icon>search</mat-icon>
            <span>Advanced Search</span>
          </a>
          <a mat-button routerLink="/my-recipes" *ngIf="isLoggedIn" class="nav-link">
            <mat-icon>book</mat-icon>
            <span>My Recipes</span>
          </a>
        </div>
        
        <div class="toolbar-right">
          <!-- Guest user menu -->
          <ng-container *ngIf="!isLoggedIn">
            <a mat-button routerLink="/login" class="auth-button">Login</a>
            <a mat-raised-button color="accent" routerLink="/register" class="auth-button">Register</a>
          </ng-container>
          
          <!-- Authenticated user menu -->
          <ng-container *ngIf="isLoggedIn">
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-button">
              <mat-icon>account_circle</mat-icon>
              <span>{{ currentUser?.name || 'User' }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            
            <mat-menu #userMenu="matMenu" class="user-menu" yPosition="above" xPosition="after" [hasBackdrop]="false" [overlapTrigger]="false">
              <a mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                <span>My Profile</span>
              </a>
              <a mat-menu-item routerLink="/my-recipes">
                <mat-icon>book</mat-icon>
                <span>My Recipes</span>
              </a>
              <a mat-menu-item routerLink="/recipes/new">
                <mat-icon>add_circle</mat-icon>
                <span>Create Recipe</span>
              </a>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>exit_to_app</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </ng-container>
        </div>
      </mat-toolbar>
      
      <div class="app-content container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--background-color);
    }
    
    .app-toolbar {
      background-color: white;
      border-bottom: 1px solid var(--accent-light);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      display: flex;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 10;
    }
    
    .toolbar-left {
      display: flex;
      align-items: center;
      
      .logo {
        display: flex;
        align-items: center;
        margin-right: 24px;
        font-size: 20px;
        font-weight: 500;
        color: var(--primary-color);
        
        mat-icon {
          margin-right: 8px;
          font-size: 24px;
          height: 24px;
          width: 24px;
        }
      }
      
      .nav-link {
        display: flex;
        align-items: center;
        margin-right: 8px;
        opacity: 0.9;
        transition: opacity 0.2s;
        color: var(--primary-color);
        
        &:hover {
          opacity: 1;
          background-color: var(--background-light);
          color: var(--primary-color);
        }
        
        mat-icon {
          margin-right: 4px;
          font-size: 18px;
          height: 18px;
          width: 18px;
        }
      }
    }
    
    .toolbar-right {
      display: flex;
      align-items: center;
      
      button, a {
        margin-left: 8px;
      }
      
      .auth-button {
        font-weight: 500;
        color: var(--text-color);
        
        &:last-child {
          background-color: var(--primary-color);
          color: white;
        }
      }
      
      .user-menu-button {
        display: flex;
        align-items: center;
        color: var(--primary-color);

        mat-icon {
          margin-right: 4px;
          
          &:last-child {
            margin-right: 0;
            margin-left: 4px;
            font-size: 18px;
            height: 18px;
            width: 18px;
          }
        }
      }
    }
    
    .app-content {
      flex-grow: 1;
      padding-top: 24px;
      padding-bottom: 24px;
      width: 100%;
      box-sizing: border-box;
    }
    
    @media (max-width: 768px) {
      .app-toolbar {
        flex-direction: column;
        height: auto;
        padding: 8px;
      }
      
      .toolbar-left, .toolbar-right {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }
      
      .toolbar-left {
        margin-bottom: 8px;
        
        .logo {
          margin-right: 8px;
          font-size: 18px;
          
          mat-icon {
            font-size: 20px;
            height: 20px;
            width: 20px;
          }
        }
        
        .nav-link {
          padding: 0 8px;
          
          span {
            display: none;
          }
          
          mat-icon {
            margin-right: 0;
          }
        }
      }
      
      .toolbar-right {
        .user-menu-button {
          span {
            max-width: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  `]
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
