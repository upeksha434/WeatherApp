import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { environment } from './environments/environment';

// Disable console logs in production
if (environment.production) {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  // Keep console.error for debugging critical issues
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
