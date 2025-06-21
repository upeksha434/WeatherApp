import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserSettings {
  temperatureUnit: 'celsius' | 'fahrenheit';
  theme: 'light' | 'dark';
  defaultLocation: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly STORAGE_KEY = 'weather-app-settings';
  
  private defaultSettings: UserSettings = {
    temperatureUnit: 'celsius',
    theme: 'dark',
    defaultLocation: 'Colombo'
  };

  private settingsSubject = new BehaviorSubject<UserSettings>(this.loadSettings());
  public settings$ = this.settingsSubject.asObservable();

  constructor() {
    // Apply saved theme on app initialization
    this.applyTheme(this.getSettings().theme);
    console.log('Settings service initialized with:', this.getSettings());
  }

  // Load settings from localStorage
  private loadSettings(): UserSettings {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Loaded settings from localStorage:', parsed);
        return { ...this.defaultSettings, ...parsed };
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }
    console.log('Using default settings');
    return this.defaultSettings;
  }

  // Save settings to localStorage
  private saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
      this.settingsSubject.next(settings);
      console.log('Settings saved to localStorage:', settings);
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }

  // Get current settings
  getSettings(): UserSettings {
    return this.settingsSubject.value;
  }

  // Update temperature unit
  setTemperatureUnit(unit: 'celsius' | 'fahrenheit'): void {
    const currentSettings = this.getSettings();
    const updatedSettings = { ...currentSettings, temperatureUnit: unit };
    this.saveSettings(updatedSettings);
  }

  // Update theme
  setTheme(theme: 'light' | 'dark'): void {
    const currentSettings = this.getSettings();
    const updatedSettings = { ...currentSettings, theme: theme };
    this.saveSettings(updatedSettings);
    this.applyTheme(theme);
  }

  // Update default location
  setDefaultLocation(location: string): void {
    const currentSettings = this.getSettings();
    const updatedSettings = { ...currentSettings, defaultLocation: location };
    this.saveSettings(updatedSettings);
  }

  // Apply theme to document
  private applyTheme(theme: 'light' | 'dark'): void {
    document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
    console.log('Applied theme:', theme);
  }

  // Convert temperature based on user preference
  convertTemperature(tempC: number): { value: number; unit: string; symbol: string } {
    const settings = this.getSettings();
    if (settings.temperatureUnit === 'fahrenheit') {
      return {
        value: Math.round((tempC * 9/5) + 32),
        unit: 'fahrenheit',
        symbol: '°F'
      };
    }
    return {
      value: Math.round(tempC),
      unit: 'celsius', 
      symbol: '°C'
    };
  }

  // Format temperature with unit
  formatTemperature(tempC: number): string {
    const converted = this.convertTemperature(tempC);
    return `${converted.value}${converted.symbol}`;
  }

  // Reset settings to default
  resetSettings(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.saveSettings(this.defaultSettings);
    this.applyTheme(this.defaultSettings.theme);
  }

  // Check if localStorage is available
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}
