import { Routes } from '@angular/router';
import { WeatherPageComponent } from './weather-page/weather-page.component';

export const routes: Routes = [
  { path: 'weather', component: WeatherPageComponent },
  { path: '', redirectTo: 'weather', pathMatch: 'full' }, // optional default route
];
