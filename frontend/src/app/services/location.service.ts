import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly STORAGE_KEY = 'weather-app-current-location';
  
  // Default location - can be overridden by settings
  private defaultLocation = 'Colombo';
  
  private currentLocationSubject = new BehaviorSubject<string>(this.loadCurrentLocation());
  public currentLocation$ = this.currentLocationSubject.asObservable();

  constructor() {
    console.log('LocationService initialized with location:', this.getCurrentLocation());
  }

  // Load current location from localStorage or use default
  private loadCurrentLocation(): string {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        console.log('Loaded current location from storage:', saved);
        return saved;
      }
    } catch (error) {
      console.error('Error loading current location from localStorage:', error);
    }
    console.log('Using default location:', this.defaultLocation);
    return this.defaultLocation;
  }

  // Save current location to localStorage
  private saveCurrentLocation(location: string): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, location);
      console.log('Saved current location to storage:', location);
    } catch (error) {
      console.error('Error saving current location to localStorage:', error);
    }
  }

  // Get current location
  getCurrentLocation(): string {
    return this.currentLocationSubject.value;
  }

  // Set current location (when user searches for a new location)
  setCurrentLocation(location: string): void {
    const trimmedLocation = location.trim();
    if (trimmedLocation && trimmedLocation !== this.getCurrentLocation()) {
      console.log('Setting current location to:', trimmedLocation);
      this.currentLocationSubject.next(trimmedLocation);
      this.saveCurrentLocation(trimmedLocation);
    }
  }  // Set default location (from settings)
  setDefaultLocation(location: string): void {
    this.defaultLocation = location;
    console.log('Setting default location to:', location);
    // Don't automatically update current location - only update when explicitly requested
  }

  // Update current location to the default (used when changing default in settings)
  updateCurrentToDefault(defaultLocation: string): void {
    this.defaultLocation = defaultLocation;
    console.log('Setting default location and updating current location to:', defaultLocation);
    this.setCurrentLocation(defaultLocation);
  }

  // Reset to default location (useful for settings page)
  resetToDefault(): void {
    console.log('Resetting location to default:', this.defaultLocation);
    this.setCurrentLocation(this.defaultLocation);
  }
}
