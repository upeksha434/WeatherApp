import { environment } from '../../environments/environment';

export class Logger {
  static log(...args: any[]): void {
    if (!environment.production) {
      console.log(...args);
    }
  }

  static error(...args: any[]): void {
    if (!environment.production) {
      console.error(...args);
    } else {
      // In production, you might want to send errors to a logging service
      // For now, we'll still log errors to console as they're important for debugging
      console.error(...args);
    }
  }

  static warn(...args: any[]): void {
    if (!environment.production) {
      console.warn(...args);
    }
  }

  static info(...args: any[]): void {
    if (!environment.production) {
      console.info(...args);
    }
  }
}
