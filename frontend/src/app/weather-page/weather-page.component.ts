import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../services/settings.service';
import { LocationService } from '../services/location.service';
import { SearchService, CityLocation } from '../services/search.service';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

interface WeatherData {
  location?: {
    name: string;
    region: string;
    country: string;
    tz_id?: string;
    localtime?: string;
  };
  current?: {
    temp_c: number;
    temp_f: number;
    humidity: number;
    wind_kph: number;
    feelslike_c:number;
    uv: number;
    condition?: {
      text: string;
      icon: string;
    };
  };
}

interface HourlyForecast {
  time: string;
  temp_c: number;
  condition: {
    text: string;
    icon: string;
  };
  chance_of_rain: number;
  humidity: number;
  wind_kph: number;
  feelslike_c: number;
  pressure_mb: number;
  uv: number;
}

interface DailyForecast {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    chance_of_rain: number;
  };
}

@Component({
  selector: 'app-weather-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './weather-page.component.html',
  styleUrl: './weather-page.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WeatherPageComponent implements OnInit {  weatherData: WeatherData | null = null;
  hourlyForecast: HourlyForecast[] = [];
  weeklyForecast: DailyForecast[] = [];
  loading = false;
  fallbackLoading = false; // Separate loading state for fallback calls
  error: string | null = null;searchQuery: string = '';
  currentLocation: string = 'Colombo'; // Default location
  selectedHours = ['00:00','03:00','06:00', '09:00', '12:00', '15:00', '18:00', '21:00']; // 6am, 9am, 12pm, 3pm, 6pm, 9pm
  currentSettings: any;
  
  // Autocomplete properties
  searchSuggestions: CityLocation[] = [];
  showSuggestions: boolean = false;
  selectedSuggestionIndex: number = -1;
  private searchSubject = new Subject<string>();
  
  // Popup state
  showHourlyPopup = false;
  selectedHourlyData: HourlyForecast | null = null;
  selectedHourIndex = 0;
  
  // Get previous, current, and next hourly data for navigation
  get navigationHourlyData() {
    if (!this.hourlyForecast.length) return { previous: null, current: null, next: null };
    
    const prevIndex = this.selectedHourIndex - 1;
    const nextIndex = this.selectedHourIndex + 1;
    
    return {
      previous: prevIndex >= 0 ? this.hourlyForecast[prevIndex] : null,
      current: this.hourlyForecast[this.selectedHourIndex] || null,
      next: nextIndex < this.hourlyForecast.length ? this.hourlyForecast[nextIndex] : null
    };
  }  constructor(
    private http: HttpClient,
    public settingsService: SettingsService,
    private locationService: LocationService,
    private searchService: SearchService
  ) {
    this.currentSettings = this.settingsService.getSettings();
  }  ngOnInit() {
    // Subscribe to settings changes
    this.settingsService.settings$.subscribe(settings => {
      this.currentSettings = settings;
      console.log('Weather page: Settings updated:', settings);
      // Don't automatically update location here - only update when explicitly changed in settings
    });

    // Subscribe to current location changes
    this.locationService.currentLocation$.subscribe(location => {
      this.currentLocation = location;
      console.log('Weather page: Current location updated to:', location);
      // Only load weather data if we have weather data or if location actually changed
      if (!this.weatherData || this.shouldLoadWeatherData(location)) {
        this.loadAllWeatherData();
      }
    });

    // Set up autocomplete search
    this.setupAutocomplete();

    console.log('Weather page initialized');
  }

  // Check if we should load weather data for the new location
  private shouldLoadWeatherData(newLocation: string): boolean {
    // If no current weather data, always load
    if (!this.weatherData) {
      return true;
    }
    
    // If location is different from what we currently have, load new data
    const currentLocationName = this.weatherData.location?.name;
    return currentLocationName?.toLowerCase() !== newLocation.toLowerCase();
  }

  // Setup autocomplete functionality
  private setupAutocomplete(): void {
    const debouncedSearch = this.searchService.createDebouncedSearch();
    debouncedSearch(this.searchSubject.asObservable()).subscribe(suggestions => {
      this.searchSuggestions = suggestions;
      this.showSuggestions = suggestions.length > 0 && this.searchQuery.trim().length >= 3;
      this.selectedSuggestionIndex = -1;
    });
  }
  // Search for weather in a new location
  searchWeather() {
    if (this.searchQuery && this.searchQuery.trim()) {
      // Use location service to set the new location
      this.locationService.setCurrentLocation(this.searchQuery.trim());
      this.searchQuery = ''; // Clear search input after search
      this.hideSuggestions(); // Hide suggestions after search
    }
  }

  // Handle search input changes
  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  // Handle keyboard navigation in suggestions
  onSearchKeyDown(event: KeyboardEvent): void {
    if (!this.showSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.min(
          this.selectedSuggestionIndex + 1,
          this.searchSuggestions.length - 1
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedSuggestionIndex >= 0) {
          this.selectSuggestion(this.searchSuggestions[this.selectedSuggestionIndex]);
        } else {
          this.searchWeather();
        }
        break;
      case 'Escape':
        this.hideSuggestions();
        break;
    }
  }

  // Select a suggestion from the dropdown
  selectSuggestion(suggestion: CityLocation): void {
    const locationName = `${suggestion.name}, ${suggestion.region}, ${suggestion.country}`;
    this.searchQuery = locationName;
    this.hideSuggestions();
    this.locationService.setCurrentLocation(locationName);
  }

  // Hide suggestions dropdown
  hideSuggestions(): void {
    this.showSuggestions = false;
    this.selectedSuggestionIndex = -1;
  }

  // Focus on suggestions dropdown
  onSearchFocus(): void {
    if (this.searchQuery.trim().length >= 3 && this.searchSuggestions.length > 0) {
      this.showSuggestions = true;
    }
  }// Optimized method to load all weather data in one API call
  loadAllWeatherData() {
    console.log('Starting to load all weather data for:', this.currentLocation);
    this.loading = true;
    this.error = null;    // Use forecast endpoint which includes current weather, hourly, and daily data
    const apiUrl = `${environment.apiUrl}/forecast/${this.currentLocation}?days=7&alerts=true`;
    console.log('Making optimized API request to:', apiUrl);
    
    this.http.get<any>(apiUrl)
      .subscribe({
        next: (data) => {
          console.log('All weather data received:', data);
          
          // Extract current weather data
          this.weatherData = {
            location: data.location,
            current: data.current
          };
          
          // Extract and process hourly forecast from first day
          if (data.forecast?.forecastday?.[0]?.hour) {
            this.hourlyForecast = this.filterHourlyData(data.forecast.forecastday[0].hour);
          }
          
          // Extract and process weekly forecast
          if (data.forecast?.forecastday) {
            this.weeklyForecast = this.processForecastData(data.forecast.forecastday);
          }
          
          console.log('Processed weather data:', {
            current: this.weatherData,
            hourly: this.hourlyForecast.length,
            weekly: this.weeklyForecast.length
          });
          
          this.loading = false;
        },
        error: (err) => {
          console.error('Weather API error:', err);          this.error = 'Failed to load weather data...';
          this.loading = false;
            // Fallback to individual API calls if the combined call fails
          console.log('Falling back to individual API calls...');
          this.fallbackLoading = true;
          // Reset fallback completion tracking
          this.fallbackCallsComplete = { weather: false, hourly: false, weekly: false };
          this.loadWeatherDataFallback();
          this.loadHourlyForecastFallback();
          this.loadWeeklyForecastFallback();
        }
      });
  }  // Keep existing individual methods as fallback
  loadWeatherDataFallback() {
    console.log('Starting fallback weather data load...');
    
    const apiUrl = `http://localhost:8000/api/weather/current/${this.currentLocation}`;
    console.log('Making fallback HTTP request to:', apiUrl);
    this.http.get<WeatherData>(apiUrl)
      .subscribe({
        next: (data) => {
          console.log('Fallback weather data received:', data);
          this.weatherData = data;
          console.log('Parsed fallback weather data:', this.weatherData);
          this.checkFallbackComplete();
        },
        error: (err) => {
          console.error('Fallback Weather API error:', err);
          this.error = 'Failed to load weather data...';
          this.fallbackLoading = false;
        }
      });
  }
    loadHourlyForecastFallback() {
    console.log('Loading fallback hourly forecast...');
    const apiUrl = `http://localhost:8000/api/weather/hourly/${this.currentLocation}?hours=24`;
    this.http.get<any>(apiUrl)
      .subscribe({
        next: (data) => {
          console.log('Fallback hourly forecast data:', data);
          this.hourlyForecast = this.filterHourlyData(data.hourly || []);
          console.log('Filtered fallback hourly forecast:', this.hourlyForecast);
          this.checkFallbackComplete();
        },
        error: (err) => {
          console.error('Fallback hourly forecast error:', err);
          this.checkFallbackComplete();
        }
      });
  }
    loadWeeklyForecastFallback() {
    console.log('Loading fallback 7-day forecast...');
    const apiUrl = `http://localhost:8000/api/weather/forecast/${this.currentLocation}?days=7`;
    this.http.get<any>(apiUrl)
      .subscribe({
        next: (data) => {
          console.log('Fallback 7-day forecast data:', data);
          console.log('Fallback forecast days count:', data.forecast?.forecastday?.length || 0);
          
          // Process the forecast data
          this.weeklyForecast = this.processForecastData(data.forecast?.forecastday || []);
          console.log('Processed fallback weekly forecast:', this.weeklyForecast);
          console.log('Fallback weekly forecast count:', this.weeklyForecast.length);
          
          // If we only get 3 days, let's add some mock data for demonstration
          if (this.weeklyForecast.length < 7) {
            console.log('Only received', this.weeklyForecast.length, 'days. Adding mock data for remaining days.');
            this.addMockForecastDays();
          }
          this.checkFallbackComplete();
        },
        error: (err) => {
          console.error('Fallback 7-day forecast error:', err);
          this.checkFallbackComplete();
        }
      });
  }

  // Check if all fallback calls are complete
  private fallbackCallsComplete = { weather: false, hourly: false, weekly: false };
  
  checkFallbackComplete() {
    // Simple completion tracking - this is basic but works
    this.fallbackCallsComplete.weather = !!this.weatherData;
    this.fallbackCallsComplete.hourly = this.hourlyForecast.length > 0;
    this.fallbackCallsComplete.weekly = this.weeklyForecast.length > 0;
    
    const allComplete = Object.values(this.fallbackCallsComplete).every(Boolean);
    if (allComplete) {
      this.fallbackLoading = false;
      console.log('All fallback calls completed');
    }
  }

  // Process forecast data to match our interface
  processForecastData(forecastData: any[]): DailyForecast[] {
    return forecastData.map(day => ({
      date: day.date,
      day: {
        maxtemp_c: day.day.maxtemp_c,
        mintemp_c: day.day.mintemp_c,
        condition: {
          text: day.day.condition.text,
          icon: day.day.condition.icon
        },
        chance_of_rain: day.day.daily_chance_of_rain || 0
      }
    }));
  }
  // Filter hourly data to show only selected hours
  filterHourlyData(hourlyData: any[]): HourlyForecast[] {
    const currentHour = this.getCurrentHourInLocationTimezone();
    console.log('Current hour in location timezone:', currentHour);
    console.log('Selected hours:', this.selectedHours);
    
    const filtered = hourlyData.filter(hour => {
      const hourTime = new Date(hour.time).getHours();
      const hourString = hourTime.toString().padStart(2, '0') + ':00';
      const isSelectedHour = this.selectedHours.includes(hourString);
      
      return isSelectedHour;
    });
    
    console.log('Filtered hours count:', filtered.length);
    return filtered.map(hour => ({
      time: new Date(hour.time).getHours().toString().padStart(2, '0') + ':00',
      temp_c: hour.temp_c,
      condition: hour.condition,
      chance_of_rain: hour.chance_of_rain || 0,
      humidity: hour.humidity || 0,
      wind_kph: hour.wind_kph || 0,
      feelslike_c: hour.feelslike_c || hour.temp_c,
      pressure_mb: hour.pressure_mb || 0,
      uv: hour.uv || 0
    }));
  }
  formatTime(timeString: string): string {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  }
  // Check if the given hour block represents the current or next relevant hour
  isCurrentHour(hourTime: string): boolean {
    // Get current hour in the location's timezone
    const currentHour = this.getCurrentHourInLocationTimezone();
    
    // Extract hour from the hourTime string (format: "HH:00")
    const forecastHour = parseInt(hourTime.split(':')[0]);
    
    // Find the next relevant forecast hour based on current time in location's timezone
    let nextRelevantHour = -1;
    for (let selectedHour of this.selectedHours) {
      const selectedHourNum = parseInt(selectedHour.split(':')[0]);
      if (selectedHourNum >= currentHour) {
        nextRelevantHour = selectedHourNum;
        break;
      }
    }
    
    // If no hour found for today, use the first hour of tomorrow (00:00)
    if (nextRelevantHour === -1) {
      nextRelevantHour = parseInt(this.selectedHours[0].split(':')[0]);
    }
    
    return forecastHour === nextRelevantHour;
  }

  // Get current hour in the location's timezone
  getCurrentHourInLocationTimezone(): number {
    if (this.weatherData?.location?.localtime) {
      // Use the localtime from the API response which is already in the location's timezone
      const localTime = new Date(this.weatherData.location.localtime);
      return localTime.getHours();
    }
    
    // Fallback to local timezone if no location time available
    return new Date().getHours();
  }

  // Get formatted local time for display
  getLocationLocalTime(): string {
    if (this.weatherData?.location?.localtime) {
      const localTime = new Date(this.weatherData.location.localtime);
      return localTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    return '';
  }

  // Format date to display proper day names
  getDayName(dateString: string, index: number): string {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (index === 0) {
      return 'Today';
    } else if (index === 1) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    }
  }

  // Add mock forecast days when API returns less than 7 days
  addMockForecastDays() {
    const currentLength = this.weeklyForecast.length;
    const mockConditions = [
      { text: 'Partly cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' },
      { text: 'Sunny', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
      { text: 'Light rain', icon: '//cdn.weatherapi.com/weather/64x64/day/296.png' },
      { text: 'Cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/119.png' }
    ];

    for (let i = currentLength; i < 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      
      const mockDay: DailyForecast = {
        date: futureDate.toISOString().split('T')[0],
        day: {
          maxtemp_c: Math.floor(Math.random() * 10) + 20, // Random temp between 20-30
          mintemp_c: Math.floor(Math.random() * 8) + 12,  // Random temp between 12-20
          condition: mockConditions[i % mockConditions.length],
          chance_of_rain: Math.floor(Math.random() * 50) // Random chance 0-50%
        }
      };
      
      this.weeklyForecast.push(mockDay);
    }
    
    console.log('Added mock data. Total forecast days:', this.weeklyForecast.length);
  }
  // Popup methods
  openHourlyPopup(hourData: HourlyForecast): void {
    // Find the index of the selected hour in the forecast array
    this.selectedHourIndex = this.hourlyForecast.findIndex(h => h.time === hourData.time);
    this.selectedHourlyData = hourData;
    this.showHourlyPopup = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeHourlyPopup(): void {
    this.showHourlyPopup = false;
    this.selectedHourlyData = null;
    this.selectedHourIndex = 0;
    document.body.style.overflow = 'auto'; // Restore scrolling
  }

  navigateToPrevious(): void {
    if (this.selectedHourIndex > 0) {
      this.selectedHourIndex--;
      this.selectedHourlyData = this.hourlyForecast[this.selectedHourIndex];
    }
  }

  navigateToNext(): void {
    if (this.selectedHourIndex < this.hourlyForecast.length - 1) {
      this.selectedHourIndex++;
      this.selectedHourlyData = this.hourlyForecast[this.selectedHourIndex];
    }
  }

  navigateToIndex(index: number): void {
    if (index >= 0 && index < this.hourlyForecast.length) {
      this.selectedHourIndex = index;
      this.selectedHourlyData = this.hourlyForecast[index];
    }
  }

  onPopupBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeHourlyPopup();
    }
  }

  // Get timezone ID for display
  getTimezoneId(): string {
    return this.weatherData?.location?.tz_id || '';
  }
}
