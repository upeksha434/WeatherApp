import { Component, Input,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class NavigationComponent {
  @Input() currentPage: string = 'weather';

  constructor(
    private router: Router,
    public settingsService: SettingsService
  ) {
    // Debug: Log router state on initialization
    console.log('NavigationComponent initialized, router URL:', this.router.url);
  }

  navigateTo(page: string) {
    console.log('Navigation: Navigating to:', page);
    console.log('Current URL before navigation:', this.router.url);
    
    // Use simple navigation for hash routing
    this.router.navigate([page]).then(
      (success) => {
        console.log('Navigation successful:', success);
        console.log('Current URL after navigation:', this.router.url);
      },
      (error) => {
        console.error('Navigation failed:', error);
      }
    ).catch((err) => {
      console.error('Navigation error caught:', err);
    });
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === `/${route}` || this.router.url === route || this.router.url.includes(route);
  }
  // Toggle between light and dark theme
  toggleTheme(): void {
    const currentTheme = this.settingsService.getSettings().theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Add animation class temporarily
    const button = document.querySelector('.theme-toggle-btn');
    if (button) {
      button.classList.add('changing');
      setTimeout(() => {
        button.classList.remove('changing');
      }, 600);
    }
    
    this.settingsService.setTheme(newTheme);
    console.log('Theme toggled to:', newTheme);
  }

  // Get current theme for UI display
  get currentTheme(): 'light' | 'dark' {
    return this.settingsService.getSettings().theme;
  }

  // Test method to check router functionality
  testNavigation() {
    console.log('Testing router navigation...');
    console.log('Available routes:', this.router.config);
  }
}
