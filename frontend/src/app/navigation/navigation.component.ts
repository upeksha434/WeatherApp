import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
})
export class NavigationComponent {
  @Input() currentPage: string = 'weather';

  constructor(private router: Router) {
    // Debug: Log router state on initialization
    console.log('NavigationComponent initialized, router URL:', this.router.url);
  }  navigateTo(page: string) {
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
  }  isActiveRoute(route: string): boolean {
    return this.router.url === `/${route}` || this.router.url === route || this.router.url.includes(route);
  }

  // Test method to check router functionality
  testNavigation() {
    console.log('Testing router navigation...');
    console.log('Available routes:', this.router.config);
  }
}
