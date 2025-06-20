import httpx
from typing import List, Optional
from config import settings
from models import CurrentWeatherResponse, ForecastResponse, SearchLocation, WeatherError


class WeatherService:
    def __init__(self):
        self.api_key = settings.weather_api_key
        self.base_url = settings.weather_api_base_url
        
    async def _make_request(self, endpoint: str, params: dict) -> dict:
        """Make HTTP request to Weather API"""
        params["key"] = self.api_key
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(f"{self.base_url}/{endpoint}", params=params)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 400:
                    error_data = e.response.json()
                    raise ValueError(error_data.get("error", {}).get("message", "Invalid request"))
                elif e.response.status_code == 401:
                    raise ValueError("Invalid API key")
                elif e.response.status_code == 403:
                    raise ValueError("API key quota exceeded")
                else:
                    raise ValueError(f"Weather API error: {e.response.status_code}")
            except httpx.RequestError as e:
                raise ValueError(f"Network error: {str(e)}")
    
    async def get_current_weather(self, location: str, aqi: bool = True) -> CurrentWeatherResponse:
        """Get current weather for a location"""
        params = {
            "q": location,
            "aqi": "yes" if aqi else "no"
        }
        
        data = await self._make_request("current.json", params)
        return CurrentWeatherResponse(**data)
    
    async def get_forecast(self, location: str, days: int = 7, aqi: bool = True, alerts: bool = True) -> ForecastResponse:
        """Get weather forecast for a location"""
        if days < 1 or days > 10:
            raise ValueError("Days must be between 1 and 10")
            
        params = {
            "q": location,
            "days": days,
            "aqi": "yes" if aqi else "no",
            "alerts": "yes" if alerts else "no"
        }
        
        data = await self._make_request("forecast.json", params)
        return ForecastResponse(**data)
    
    async def search_locations(self, query: str) -> List[SearchLocation]:
        """Search for locations"""
        params = {"q": query}
        
        data = await self._make_request("search.json", params)
        return [SearchLocation(**location) for location in data]
    
    async def get_astronomy(self, location: str, date: Optional[str] = None) -> dict:
        """Get astronomy data for a location"""
        params = {"q": location}
        if date:
            params["dt"] = date
            
        data = await self._make_request("astronomy.json", params)
        return data
    
    async def get_air_quality(self, location: str) -> dict:
        """Get air quality data for a location"""
        params = {
            "q": location,
            "aqi": "yes"
        }
        
        data = await self._make_request("current.json", params)
        return data.get("current", {}).get("air_quality", {})


weather_service = WeatherService()
