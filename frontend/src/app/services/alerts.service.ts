import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  expires?: string;
  event?: string;
  areas?: string;
  isRead: boolean;
}

export interface AlertsResponse {
  location: any;
  alerts: WeatherAlert[];
}

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private baseUrl = environment.apiUrl.replace('/weather', '');

  constructor(private http: HttpClient) {}getAlerts(location: string): Observable<AlertsResponse> {
    return this.http.get<any>(`${this.baseUrl}/weather/alerts/${encodeURIComponent(location)}`)
      .pipe(
        // Transform the response to convert timestamp strings to Date objects
        map(response => ({
          location: response.location,
          alerts: response.alerts.map((alert: any) => ({
            ...alert,
            timestamp: alert.timestamp ? new Date(alert.timestamp) : new Date()
          }))
        })),
        catchError(error => {
          console.error('Error fetching alerts:', error);
          console.log('Using mock data as fallback due to API error');
          // Only return mock data if there's a real API error, not when there are no alerts
          return of({
            location: { name: location },
            alerts: this.getMockAlerts()
          });
        })
      );
  }
  private getMockAlerts(): WeatherAlert[] {
    return [
      {
        id: '1',
        title: 'Heavy Rain Warning',
        description: 'Heavy rainfall expected in your area from 3:00 PM to 6:00 PM today. Potential for localized flooding.',
        severity: 'high',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false
      },
      {
        id: '2',
        title: 'High Wind Advisory',
        description: 'Strong winds up to 45 mph expected tonight. Secure outdoor objects and use caution while driving.',
        severity: 'medium',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: true
      },
      {
        id: '3',
        title: 'Temperature Drop',
        description: 'Temperatures will drop significantly overnight. Consider bringing plants indoors.',
        severity: 'low',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        isRead: true
      }
    ];
  }
}
