# 🌤️ Weather App

> A beautiful, modern weather application built with Angular and FastAPI that brings you accurate weather forecasts with style.

![Weather App Preview](frontend/src/assets/weather-page.png)

## ✨ What Makes This Special

This isn't just another weather app – it's a carefully crafted experience that makes checking the weather a joy. With its sleek dark theme, intuitive navigation, and comprehensive weather data, you'll always be prepared for whatever Mother Nature has in store.

## 🚀 Features That You'll Love

### 🎯 **Smart Location Search**
- **Intelligent autocomplete** - Start typing any city and watch the magic happen
- **Global coverage** - From New York to Tokyo, we've got you covered
- **One-click selection** - Pick your city from the dropdown and you're good to go

### 📊 **Comprehensive Weather Data**
- **Current conditions** - Temperature, weather description, and "feels like" temperature
- **7-day forecast** - Plan your week with confidence
- **Hourly breakdown** - See how the day unfolds hour by hour
- **Detailed metrics** - Humidity, wind speed, pressure, and more

### 🎨 **Beautiful User Experience**
- **Dark theme design** - Easy on the eyes, especially during those late-night weather checks
- **Responsive layout** - Looks great on desktop, tablet, and mobile
- **Smooth animations** - Every interaction feels fluid and natural
- **Interactive hourly popup** - Tap any hour to see detailed information

### 🌍 **Real-Time Updates**
- **Live weather data** - Always up-to-date information
- **Local time zones** - See the current time for any location
- **Weather alerts** - Stay informed about important weather conditions

## 🛠️ Built Using

### Frontend 
- **Angular 19** - The latest and greatest for building dynamic web apps
- **TypeScript** - Type-safe code that prevents bugs before they happen
- **CSS Grid & Flexbox** - Modern layout techniques for pixel-perfect design
- **Responsive Design** - One codebase, every device

### Backend 
- **FastAPI** - Lightning-fast Python web framework
- **WeatherAPI** - Reliable weather data from trusted sources
- **CORS handling** - Seamless frontend-backend communication

### Deployment & Infrastructure
- **Vercel** - Frontend hosting that just works
- **Render** - Reliable backend hosting
- **Git** - Version control for seamless collaboration

## 🎮 How to Experience It

### Option 1: Just Use It! (Recommended)
Visit the live app at: **[Your Deployment URL Here]**

### Option 2: Run It Locally

#### Quick Start (Development)
```bash
# Clone this awesome project
git clone [repo-url]
cd WeatherApp

# Frontend setup
cd frontend
npm install
npm start

# Backend setup (in a new terminal)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Advanced Setup (Full Local Development)
```bash
# Frontend with local backend proxy
cd frontend
npm run start:local  # Uses local backend via proxy

# Backend
cd backend
python -m uvicorn main:app --reload --port 8000
```

## 🎨 What You'll See

### 🏠 **Home Dashboard**
A clean, organized view with:
- Current weather prominently displayed
- Today's hourly forecast
- Quick access to different locations
- Beautiful weather icons that match the conditions

### 📱 **Navigation Made Simple**
- **Weather page** - Your main weather hub
- **Alerts page** - Important weather notifications
- **Settings page** - Customize your experience
- **Theme toggle** - Switch between light and dark modes

### 🔍 **Interactive Elements**
- **Clickable hourly items** - Tap to see detailed hour-by-hour breakdowns
- **Smooth transitions** - Every interaction feels responsive
- **Hover effects** - Visual feedback that makes the app feel alive

## 🏗️ Project Structure

```
WeatherApp/
├── frontend/                 # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Reusable UI components
│   │   │   ├── services/     # Data and business logic
│   │   │   └── pages/        # Main application pages
│   │   ├── assets/           # Images and static files
│   │   └── environments/     # Configuration files
│   └── package.json          # Dependencies and scripts
│
├── backend/                  # FastAPI application
│   ├── main.py              # Application entry point
│   ├── routes.py            # API endpoints
│   ├── services.py          # Business logic
│   ├── models.py            # Data models
│   └── requirements.txt     # Python dependencies
│
└── README.md                # You are here! 👋
```

## 🌟 Key Features Breakdown

### Smart Weather Search
The search functionality uses intelligent autocomplete to help you find any location worldwide. Just start typing, and you'll see relevant suggestions appear instantly.

### Comprehensive Forecasting
- **Current Weather**: Real-time conditions with temperature, description, and "feels like" readings
- **7-Day Forecast**: Daily highs and lows with weather conditions
- **Hourly Details**: Hour-by-hour breakdown for the next 24 hours
- **Weather Metrics**: Humidity, wind speed, atmospheric pressure, and visibility

### Responsive Design
The app adapts beautifully to any screen size, from large desktop monitors to mobile phones, ensuring a great experience everywhere.

## 🔧 Environment Configuration

The app automatically handles different environments:
- **Development**: Uses local backend when available
- **Production**: Connects to live backend services
- **Proxy Support**: Local development with production-like data flow

