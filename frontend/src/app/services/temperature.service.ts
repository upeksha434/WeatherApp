import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

@Injectable({
  providedIn: 'root'
})
export class TemperatureService {
  private currentUnit: TemperatureUnit = 'celsius';
  private unitSubject = new BehaviorSubject<TemperatureUnit>(this.currentUnit);
  
  public unit$ = this.unitSubject.asObservable();

  constructor() {
    // Load saved unit preference from localStorage
    const savedUnit = localStorage.getItem('temperatureUnit');
    if (savedUnit && (savedUnit === 'celsius' || savedUnit === 'fahrenheit')) {
      this.currentUnit = savedUnit as TemperatureUnit;
      this.unitSubject.next(this.currentUnit);
    }
  }

  getCurrentUnit(): TemperatureUnit {
    return this.currentUnit;
  }

  setUnit(unit: TemperatureUnit): void {
    this.currentUnit = unit;
    this.unitSubject.next(unit);
    localStorage.setItem('temperatureUnit', unit);
  }

  // Convert Celsius to Fahrenheit
  celsiusToFahrenheit(celsius: number): number {
    return Math.round((celsius * 9/5) + 32);
  }

  // Convert temperature based on current unit
  convertTemperature(celsius: number): number {
    return this.currentUnit === 'fahrenheit' ? this.celsiusToFahrenheit(celsius) : celsius;
  }

  // Get the temperature unit symbol
  getUnitSymbol(): string {
    return this.currentUnit === 'fahrenheit' ? '°F' : '°C';
  }

  // Format temperature with unit
  formatTemperature(celsius: number): string {
    const temp = this.convertTemperature(celsius);
    return `${temp}${this.getUnitSymbol()}`;
  }
}
