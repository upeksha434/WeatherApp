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
    
    async def get_current_weather(self, location: str) -> CurrentWeatherResponse:
        """Get current weather for a location"""
        params = {"q": location}
        
        data = await self._make_request("current.json", params)
        return CurrentWeatherResponse(**data)
    
    async def get_forecast(self, location: str, days: int = 7, alerts: bool = True) -> ForecastResponse:
        """Get weather forecast for a location"""
        if days < 1 or days > 10:
            raise ValueError("Days must be between 1 and 10")
            
        params = {
            "q": location,
            "days": days,
            "alerts": "yes" if alerts else "no"
        }        
        data = await self._make_request("forecast.json", params)
        return ForecastResponse(**data)
    
    async def search_locations(self, query: str) -> List[SearchLocation]:
        """Search for locations"""
        params = {"q": query}
        
        data = await self._make_request("search.json", params)
        return [SearchLocation(**location) for location in data]
    
    async def get_alerts(self, location: str) -> dict:
        """Get weather alerts for a location"""
        params = {
            "q": location,
            "alerts": "yes"
        }
        
        # Use forecast endpoint with alerts to get alert data
        data = await self._make_request("forecast.json", params)
        
        # Extract alerts from the response
        alerts = data.get("alerts", {"alert": []})
        
        # Transform alerts data for frontend consumption
        transformed_alerts = []
        for alert in alerts.get("alert", []):
            transformed_alerts.append({
                "id": str(hash(alert.get("headline", "") + alert.get("effective", ""))),
                "title": alert.get("headline", "Weather Alert"),
                "description": alert.get("desc", ""),
                "severity": self._map_severity(alert.get("severity", "")),
                "timestamp": alert.get("effective", ""),
                "expires": alert.get("expires", ""),
                "event": alert.get("event", ""),
                "areas": alert.get("areas", ""),
                "isRead": False
            })
        
        return {
            "location": data.get("location", {}),
            "alerts": transformed_alerts
        }
    
    def _map_severity(self, severity: str) -> str:
        """Map WeatherAPI severity to our frontend severity levels"""
        severity_lower = severity.lower()
        if severity_lower in ["extreme", "severe"]:
            return "high"
        elif severity_lower in ["moderate", "minor"]:
            return "medium"
        else:
            return "low"


weather_service = WeatherService()