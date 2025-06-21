import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavigationComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  constructor(
    private router: Router,
    private settingsService: SettingsService
  ) {}
  
  ngOnInit() {
    // Settings service will automatically apply the saved theme on initialization
    console.log('App initialized with settings:', this.settingsService.getSettings());
    
    // Debug: Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log('Route changed to:', event.url);
      });
    
    console.log('App component initialized, current route:', this.router.url);
  }
}
