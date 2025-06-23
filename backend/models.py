from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class Location(BaseModel):
    name: str
    region: str
    country: str
    lat: float
    lon: float
    tz_id: str
    localtime: str


class Condition(BaseModel):
    text: str
    icon: str
    code: int


class Current(BaseModel):
    last_updated: str
    temp_c: float
    temp_f: float
    is_day: int
    condition: Condition
    wind_mph: float
    wind_kph: float
    wind_degree: int
    wind_dir: str
    pressure_mb: float
    pressure_in: float
    precip_mm: float
    precip_in: float
    humidity: int
    cloud: int
    feelslike_c: float
    feelslike_f: float
    vis_km: float
    vis_miles: float
    uv: float
    gust_mph: float
    gust_kph: float


class CurrentWeatherResponse(BaseModel):
    location: Location
    current: Current


class HourlyForecast(BaseModel):
    time: str
    temp_c: float
    temp_f: float
    is_day: int
    condition: Condition
    wind_mph: float
    wind_kph: float
    wind_degree: int
    wind_dir: str
    pressure_mb: float
    pressure_in: float
    precip_mm: float
    precip_in: float
    humidity: int
    cloud: int
    feelslike_c: float
    feelslike_f: float
    windchill_c: float
    windchill_f: float
    heatindex_c: float
    heatindex_f: float
    dewpoint_c: float
    dewpoint_f: float
    will_it_rain: int
    chance_of_rain: int
    will_it_snow: int
    chance_of_snow: int
    vis_km: float
    vis_miles: float
    gust_mph: float
    gust_kph: float
    uv: float


class Day(BaseModel):
    maxtemp_c: float
    maxtemp_f: float
    mintemp_c: float
    mintemp_f: float
    avgtemp_c: float
    avgtemp_f: float
    maxwind_mph: float
    maxwind_kph: float
    totalprecip_mm: float
    totalprecip_in: float
    totalsnow_cm: float
    avgvis_km: float
    avgvis_miles: float
    avghumidity: float
    daily_will_it_rain: int
    daily_chance_of_rain: int
    daily_will_it_snow: int
    daily_chance_of_snow: int
    condition: Condition
    uv: float


class ForecastDay(BaseModel):
    date: str
    date_epoch: int
    day: Day
    hour: List[HourlyForecast]


class Forecast(BaseModel):
    forecastday: List[ForecastDay]


class WeatherAlert(BaseModel):
    headline: str
    msgtype: str
    severity: str
    urgency: str
    areas: str
    category: str
    certainty: str
    event: str
    note: str
    effective: str
    expires: str
    desc: str
    instruction: str


class Alerts(BaseModel):
    alert: List[WeatherAlert]


class ForecastResponse(BaseModel):
    location: Location
    current: Current
    forecast: Forecast
    alerts: Optional[Alerts] = None


class SearchLocation(BaseModel):
    id: int
    name: str
    region: str
    country: str
    lat: float
    lon: float
    url: str


class WeatherError(BaseModel):
    error: str
    code: int
    message: str
