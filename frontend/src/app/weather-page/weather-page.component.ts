import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
}

@Component({
  selector: 'app-weather-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-page.component.html',
  styleUrl: './weather-page.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WeatherPageComponent implements OnInit {
  weatherData: WeatherData | null = null;
  hourlyForecast: HourlyForecast[] = [];
  loading = false;
  error: string | null = null;
  selectedHours = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00']; // 6am, 9am, 12pm, 3pm, 6pm, 9pm

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('Weather page initialized, loading weather data...');
    this.loadWeatherData();
    this.loadHourlyForecast();
  }
  
  loadWeatherData() {
    console.log('Starting to load weather data...');
    this.loading = true;
    this.error = null;
    
    console.log('Making HTTP request to:', 'http://localhost:8000/api/weather/current/Colombo');
    this.http.get<WeatherData>('http://localhost:8000/api/weather/current/Colombo')
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
    this.http.get<any>('http://localhost:8000/api/weather/hourly/Colombo?hours=24')
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
      const isCurrentOrFuture = hourTime >= currentHour;
      
      console.log(`Hour ${hourTime} (${hourString}): selected=${isSelectedHour}, future=${isCurrentOrFuture}`);
      return isSelectedHour && isCurrentOrFuture;
    });
    
    console.log('Filtered hours count:', filtered.length);
    
    return filtered.map(hour => ({
    //   time: this.formatTime(hour.time),
      time:new Date(hour.time).getHours().toString().padStart(2, '0') + ':00',
      temp_c: hour.temp_c,
      condition: hour.condition,
      chance_of_rain: hour.chance_of_rain || 0
    }));
  }

  formatTime(timeString: string): string {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  }
}
