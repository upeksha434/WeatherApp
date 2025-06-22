import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SettingsService } from '../services/settings.service';
import { AlertsService, WeatherAlert } from '../services/alerts.service';

@Component({
  selector: 'app-alerts-page',
  imports: [CommonModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './alerts-page.component.html',
  styleUrl: './alerts-page.component.css'
})
export class AlertsPageComponent implements OnInit {
  private settingsService = inject(SettingsService);
  private alertsService = inject(AlertsService);
  
  alerts: WeatherAlert[] = [];
  unreadCount: number = 0;
  isLoading: boolean = false;
  currentLocation: string = 'Colombo';
  ngOnInit() {
    // Get current location from settings
    this.settingsService.settings$.subscribe(settings => {
      this.currentLocation = settings.defaultLocation;
      this.loadAlerts();
    });
  }loadAlerts() {
    this.isLoading = true;
    this.alertsService.getAlerts(this.currentLocation).subscribe({
      next: (response) => {
        this.alerts = response.alerts;
        this.updateUnreadCount();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading alerts:', error);
        this.isLoading = false;
        // Fallback to empty alerts
        this.alerts = [];
        this.updateUnreadCount();
      }
    });
  }

  markAsRead(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.isRead) {
      alert.isRead = true;
      this.updateUnreadCount();
    }
  }

  markAllAsRead() {
    this.alerts.forEach(alert => alert.isRead = true);
    this.updateUnreadCount();
  }

  deleteAlert(alertId: string) {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
    this.updateUnreadCount();
  }

  clearAllAlerts() {
    this.alerts = [];
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    this.unreadCount = this.alerts.filter(alert => !alert.isRead).length;
  }

  getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'high': return 'material-symbols:warning';
      case 'medium': return 'material-symbols:info';
      case 'low': return 'material-symbols:notifications';
      default: return 'material-symbols:notifications';
    }
  }

  formatTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }
}
