import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService, UserSettings } from '../services/settings.service';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-setting-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setting-page.component.html',
  styleUrl: './setting-page.component.css'
})
export class SettingPageComponent implements OnInit {
  settings: UserSettings;

  constructor(
    private settingsService: SettingsService,
    private locationService: LocationService
  ) {
    this.settings = this.settingsService.getSettings();
  }

  ngOnInit() {
    // Subscribe to settings changes
    this.settingsService.settings$.subscribe(settings => {
      this.settings = settings;
      console.log('Settings updated in component:', settings);
    });
  }

  onTemperatureUnitChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const unit = target.value as 'celsius' | 'fahrenheit';
    console.log('Temperature unit changed to:', unit);
    this.settingsService.setTemperatureUnit(unit);
  }

  onThemeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const theme = target.value as 'light' | 'dark';
    console.log('Theme changed to:', theme);
    this.settingsService.setTheme(theme);
  }  onLocationChange(event: any) {
    const location = event.target.value;
    console.log('Default location changed to:', location);
    this.settingsService.setDefaultLocation(location);
    // Update the location service to immediately reflect the change
    this.locationService.updateCurrentToDefault(location);
  }  resetToDefaults() {
    console.log('Resetting settings to defaults');
    this.settingsService.resetSettings();
    // Also reset location service to default
    const defaultSettings = this.settingsService.getSettings();
    this.locationService.updateCurrentToDefault(defaultSettings.defaultLocation);
  }
}
