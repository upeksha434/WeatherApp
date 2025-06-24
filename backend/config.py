from pydantic import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Weather API Configuration
    weather_api_key: str
    weather_api_base_url: str = "http://api.weatherapi.com/v1"
    
    # FastAPI Configuration
    app_name: str = "Weather App API"
    app_version: str = "1.0.0"
    debug: bool = True
      # CORS Settings
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:4200",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:4200",
        "http://127.0.0.1:5173"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
