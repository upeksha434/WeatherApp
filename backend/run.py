#!/usr/bin/env python3
"""
Weather App Backend Startup Script
Run this script to start the FastAPI development server
"""

import uvicorn
from main import app

if __name__ == "__main__":
    print("🌤️  Starting Weather App Backend...")
    print("📡 API Documentation: http://localhost:8000/docs")
    print("🔄 Interactive API: http://localhost:8000/redoc")
    print("🌍 Health Check: http://localhost:8000/health")    
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
