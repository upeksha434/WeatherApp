import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';

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
    uv: number;
    condition?: {
      text: string;
      icon: string;
    };
  };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  weatherData: WeatherData | null = null;
  loading = false;
  error: string | null = null;
  currentPage = 'weather'; // Track current page for navigation

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('Component initialized, loading weather data...');
    this.loadWeatherData();
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
          this.loading = false;
        },
        error: (err) => {
          console.error('Weather API error:', err);
          this.error = 'Failed to load weather data...';
          this.loading = false;
        }
      });
  }

  // Handle page change from navigation component
  onPageChange(page: string) {
    console.log('Page changed to:', page);
    this.currentPage = page;
  }
}
