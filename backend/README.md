# Weather App Backend API

A comprehensive FastAPI backend for a weather application using WeatherAPI.com.

## 🌟 Features

- **Current Weather**: Get real-time weather data for any location
- **7-Day Forecast**: Detailed weather forecasts up to 7 days
- **Hourly Forecast**: Hour-by-hour weather data (up to 48 hours)
- **Location Search**: Search for cities and locations worldwide
- **Air Quality**: Air quality index and pollutant levels
- **Astronomy Data**: Sunrise, sunset, moon phases, etc.
- **CORS Support**: Ready for frontend integration
- **Error Handling**: Comprehensive error handling and validation
- **API Documentation**: Auto-generated interactive docs

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Setup

Copy the example environment file and add your API key:

```bash
copy .env.example .env
```

Then edit `.env` and add your WeatherAPI.com API key:

```
WEATHER_API_KEY=your_api_key_here
```

### 3. Run the Server

```bash
python run.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API Base**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📋 API Endpoints

### Current Weather
```
GET /api/weather/current/{location}?aqi=true
```
Get current weather conditions for a location.

### Weather Forecast
```
GET /api/weather/forecast/{location}?days=7&aqi=true&alerts=true
```
Get weather forecast for up to 7 days.

### Hourly Forecast
```
GET /api/weather/hourly/{location}?hours=24
```
Get hourly weather data (up to 48 hours).

### Search Locations
```
GET /api/weather/search?q=colombo
```
Search for locations by name.

### Air Quality
```
GET /api/weather/air-quality/{location}
```
Get air quality data for a location.

### Astronomy Data
```
GET /api/weather/astronomy/{location}?date=2023-07-22
```
Get sunrise, sunset, and moon data.

## 🌍 Example Usage

### Get Current Weather for Colombo
```bash
curl "http://localhost:8000/api/weather/current/Colombo"
```

### Get 7-Day Forecast
```bash
curl "http://localhost:8000/api/weather/forecast/Colombo?days=7"
```

### Search for Cities
```bash
curl "http://localhost:8000/api/weather/search?q=new%20york"
```

## 📊 Response Examples

### Current Weather Response
```json
{
  "location": {
    "name": "Colombo",
    "region": "Western Province",
    "country": "Sri Lanka",
    "lat": 6.93,
    "lon": 79.85,
    "tz_id": "Asia/Colombo",
    "localtime": "2023-07-22 14:30"
  },
  "current": {
    "last_updated": "2023-07-22 14:30",
    "temp_c": 28.0,
    "temp_f": 82.4,
    "humidity": 75,
    "wind_kph": 15.1,
    "uv": 6.0,
    "condition": {
      "text": "Partly cloudy",
      "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
      "code": 1003
    }
  }
}
```

## 🔧 Configuration

Environment variables in `.env`:

- `WEATHER_API_KEY`: Your WeatherAPI.com API key (required)
- `WEATHER_API_BASE_URL`: Base URL for WeatherAPI (default: http://api.weatherapi.com/v1)
- `APP_NAME`: Application name
- `APP_VERSION`: Application version
- `DEBUG`: Enable debug mode (true/false)
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)

## 🛡️ Security

- API key is stored in environment variables (not committed to git)
- CORS is configured for frontend integration
- Input validation using Pydantic models
- Proper error handling and status codes

## 📝 Available Data

The API provides comprehensive weather data including:

- **Temperature**: Current, feels like, min/max
- **Humidity**: Relative humidity percentage
- **Wind**: Speed, direction, gusts
- **Pressure**: Atmospheric pressure
- **Precipitation**: Rain/snow amounts and probability
- **UV Index**: UV radiation levels
- **Visibility**: Visibility distance
- **Air Quality**: PM2.5, PM10, CO, NO2, O3, SO2 levels
- **Astronomy**: Sunrise, sunset, moon phases
- **Weather Conditions**: Descriptive text and icons

## 🎯 Frontend Integration

The API is designed to work seamlessly with frontend applications. It includes:

- CORS support for local development
- Consistent JSON responses
- Comprehensive error messages
- RESTful endpoint design

## 🐛 Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (invalid location, parameters)
- `401`: Unauthorized (invalid API key)
- `403`: Forbidden (quota exceeded)
- `500`: Internal Server Error

## 📄 License

This project is for educational purposes.
