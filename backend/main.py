from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from config import settings
from routes import router
import uvicorn



# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="A comprehensive weather API built with FastAPI and WeatherAPI.com",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://weather-app-neon-theta-84.vercel.app",
        "https://weather-app-eight-taupe-29.vercel.app",
        "*"  # Allow all for debugging
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include weather routes
app.include_router(router, prefix="/api/weather", tags=["weather"])


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to Weather App API",
        "version": settings.app_version,
        "docs": "/docs",        "endpoints": {
            "current_weather": "/api/weather/current/{location}",
            "forecast": "/api/weather/forecast/{location}",
            "search_locations": "/api/weather/search?q={query}",
            "hourly_forecast": "/api/weather/hourly/{location}",
            "astronomy": "/api/weather/astronomy/{location}",
            "air_quality": "/api/weather/air-quality/{location}",
            "alerts": "/api/weather/alerts/{location}"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "weather-api"}


# Exception handlers
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"error": "Bad Request", "detail": str(exc)}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "detail": "Something went wrong"}
    )



if __name__ == "__main__":
    import os
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=settings.debug,
        log_level="info"
    )
