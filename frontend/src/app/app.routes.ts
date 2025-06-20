import { Routes } from '@angular/router';
import { WeatherPageComponent } from './weather-page/weather-page.component';
import { SettingPageComponent } from './setting-page/setting-page.component';

export const routes: Routes = [
  { path: 'weather', component: WeatherPageComponent },
  { path: 'settings', component: SettingPageComponent },
  { path: '', redirectTo: '/weather', pathMatch: 'full' }
];
