import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<Theme>('dark');
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    // Load theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('weather-app-theme') as Theme;
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      this.setTheme(savedTheme);
    }
  }

  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    localStorage.setItem('weather-app-theme', theme);
    this.applyTheme(theme);
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  private applyTheme(theme: Theme): void {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('dark-theme', 'light-theme');
    
    // Add new theme class
    body.classList.add(`${theme}-theme`);
  }
}
