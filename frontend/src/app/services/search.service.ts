import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

export interface CityLocation {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = 'http://localhost:8000/api/weather';

  constructor(private http: HttpClient) {}

  searchCities(query: string): Observable<CityLocation[]> {
    if (!query || query.trim().length < 3) {
      return of([]);
    }

    return this.http.get<CityLocation[]>(`${this.baseUrl}/search`, {
      params: { q: query.trim() }
    }).pipe(
      catchError(error => {
        console.error('Error searching cities:', error);
        return of([]);
      })
    );
  }

  // Create a search function with debouncing for autocomplete
  createDebouncedSearch() {
    return (query$: Observable<string>) =>
      query$.pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged(), // Only emit when the query changes
        switchMap(query => this.searchCities(query))
      );
  }
}
