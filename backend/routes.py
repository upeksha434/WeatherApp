from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from services import weather_service
from models import CurrentWeatherResponse, ForecastResponse, SearchLocation

router = APIRouter()


@router.get("/current/{location}", response_model=CurrentWeatherResponse)
async def get_current_weather(location: str):
    """Get current weather for a specific location"""
    print(f"[REQUEST RECEIVED] Location: {location}")
    try:
        return await weather_service.get_current_weather(location)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/forecast/{location}", response_model=ForecastResponse)
async def get_forecast(
    location: str,
    days: int = Query(7, ge=1, le=10, description="Number of days (1-10)"),
    alerts: bool = Query(True, description="Include weather alerts")
):
    """Get weather forecast for a specific location"""
    try:
        return await weather_service.get_forecast(location, days, alerts)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/search", response_model=List[SearchLocation])
async def search_locations(
    q: str = Query(..., min_length=3, description="Search query (minimum 3 characters)")
):
    """Search for locations"""
    try:
        return await weather_service.search_locations(q)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")



@router.get("/hourly/{location}")
async def get_hourly_forecast(
    location: str,
    hours: int = Query(24, ge=1, le=48, description="Number of hours (1-48)")
):
    """Get hourly forecast for a location"""
    try:
        # Get 2-day forecast to cover up to 48 hours
        days_needed = 2 if hours > 24 else 1
        forecast = await weather_service.get_forecast(location, days_needed)
        
        # Extract hourly data
        hourly_data = []
        for day in forecast.forecast.forecastday:
            for hour in day.hour:
                hourly_data.append(hour)
                if len(hourly_data) >= hours:
                    break
            if len(hourly_data) >= hours:
                break
        
        return {
            "location": forecast.location,
            "hourly": hourly_data[:hours]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/alerts/{location}")
async def get_alerts(location: str):
    """Get weather alerts for a location"""
    try:
        return await weather_service.get_alerts(location)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
