import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../services/settings.service';

interface WeatherData {
  location?: {
    name: string;
    region: string;
    country: string;
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
  imports: [CommonModule, FormsModule],
  templateUrl: './weather-page.component.html',
  styleUrl: './weather-page.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WeatherPageComponent implements OnInit {
  weatherData: WeatherData | null = null;
  hourlyForecast: HourlyForecast[] = [];
  weeklyForecast: DailyForecast[] = [];
  loading = false;
  error: string | null = null;  searchQuery: string = '';
  currentLocation: string = 'Colombo'; // Default location
  selectedHours = ['00:00','03:00','06:00', '09:00', '12:00', '15:00', '18:00', '21:00']; // 6am, 9am, 12pm, 3pm, 6pm, 9pm
  currentSettings: any;
  
  // Popup state
  showHourlyPopup = false;
  selectedHourlyData: HourlyForecast | null = null;

  constructor(
    private http: HttpClient,
    public settingsService: SettingsService
  ) {
    this.currentSettings = this.settingsService.getSettings();
  }

  ngOnInit() {
    // Subscribe to settings changes
    this.settingsService.settings$.subscribe(settings => {
      this.currentSettings = settings;
      console.log('Weather page: Settings updated:', settings);
    });

    // Load weather data for the saved default location
    const defaultLocation = this.currentSettings.defaultLocation || 'Colombo';
    this.currentLocation = defaultLocation;
    console.log('Loading weather for default location:', defaultLocation);
    
    console.log('Weather page initialized, loading weather data...');
    this.loadWeatherData();
    this.loadHourlyForecast();
    this.loadWeeklyForecast();
  }
  // Search for weather in a new location
  searchWeather() {
    if (this.searchQuery && this.searchQuery.trim()) {
      this.currentLocation = this.searchQuery.trim();
      this.loadWeatherData();
      this.loadHourlyForecast();
      this.loadWeeklyForecast();
      this.searchQuery = ''; // Clear search input after search
    }
  }
  
  loadWeatherData() {
    console.log('Starting to load weather data...');
    this.loading = true;
    this.error = null;
    
    const apiUrl = `http://localhost:8000/api/weather/current/${this.currentLocation}`;
    console.log('Making HTTP request to:', apiUrl);
    this.http.get<WeatherData>(apiUrl)
      .subscribe({
        next: (data) => {
          console.log('Weather data received:', data);
          this.weatherData = data;
          console.log('Parsed weather data:', this.weatherData);
          this.loading = false;
        },
        error: (err) => {
          console.error('Weather API error:', err);
          this.error = 'Failed to load weather data...';
          this.loading = false;
        }
      });
  }
  loadHourlyForecast() {
    console.log('Loading hourly forecast...');
    const apiUrl = `http://localhost:8000/api/weather/hourly/${this.currentLocation}?hours=24`;
    this.http.get<any>(apiUrl)
      .subscribe({
        next: (data) => {
          console.log('Hourly forecast data:', data);
          // The API returns data.hourly directly, not data.forecast.forecastday[0].hour
          this.hourlyForecast = this.filterHourlyData(data.hourly || []);
          console.log('Filtered hourly forecast:', this.hourlyForecast);
        },
        error: (err) => {
          console.error('Hourly forecast error:', err);
        }
      });
  }  loadWeeklyForecast() {
    console.log('Loading 7-day forecast...');
    const apiUrl = `http://localhost:8000/api/weather/forecast/${this.currentLocation}?days=7`;
    this.http.get<any>(apiUrl)
      .subscribe({
        next: (data) => {
          console.log('7-day forecast data:', data);
          console.log('Forecast days count:', data.forecast?.forecastday?.length || 0);
          
          // Process the forecast data
          this.weeklyForecast = this.processForecastData(data.forecast?.forecastday || []);
          console.log('Processed weekly forecast:', this.weeklyForecast);
          console.log('Weekly forecast count:', this.weeklyForecast.length);
          
          // If we only get 3 days, let's add some mock data for demonstration
          if (this.weeklyForecast.length < 7) {
            console.log('Only received', this.weeklyForecast.length, 'days. Adding mock data for remaining days.');
            this.addMockForecastDays();
          }
        },
        error: (err) => {
          console.error('7-day forecast error:', err);
        }
      });
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
    const currentHour = new Date().getHours();
    console.log('Current hour:', currentHour);
    console.log('Selected hours:', this.selectedHours);
    
    const filtered = hourlyData.filter(hour => {
      const hourTime = new Date(hour.time).getHours();
      const hourString = hourTime.toString().padStart(2, '0') + ':00';
      const isSelectedHour = this.selectedHours.includes(hourString);
      // const isCurrentOrFuture = hourTime >= currentHour;
      
      // console.log(`Hour ${hourTime} (${hourString}): selected=${isSelectedHour}, future=${isCurrentOrFuture}`);
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
    const currentHour = new Date().getHours();
    
    // Extract hour from the hourTime string (format: "HH:00")
    const forecastHour = parseInt(hourTime.split(':')[0]);
    
    // Find the next relevant forecast hour based on current time
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
    this.selectedHourlyData = hourData;
    this.showHourlyPopup = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeHourlyPopup(): void {
    this.showHourlyPopup = false;
    this.selectedHourlyData = null;
    document.body.style.overflow = 'auto'; // Restore scrolling
  }

  onPopupBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeHourlyPopup();
    }
  }
}
