# Weather Widget PWA

A Progressive Web App that displays real-time weather information with animated radar maps and detailed weather metrics.

![Weather Widget](https://img.shields.io/badge/PWA-Ready-blue)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### Core Functionality
- 🌡️ **Real-time Weather Data**: Current conditions and 7-day forecast from Weather.gov
- 📍 **Auto Location Detection**: IP-based geolocation with browser fallback
- 🗺️ **Animated Weather Radar**: Interactive RainViewer radar with play/pause controls
- ❄️ **Feels Like Temperature**: Wind chill and heat index calculations
- 🔄 **Smart Caching**: 15-minute weather cache, 24-hour location cache
- ⚙️ **User Configurable**: Customizable auto-refresh intervals
- 📱 **PWA Support**: Installable on Chrome OS, mobile, and desktop
- 🖥️ **Kiosk Mode Ready**: Perfect for always-on displays

### Weather Detail Cards (MSN Weather Style)
- **Temperature**: Current temp with trend information
- **Feels Like**: Wind chill/heat index with dominant factor indicator
- **Wind**: Animated compass showing direction and speed
- **Humidity**: Visual bar chart with dew point
- **UV Index**: Color-coded gauge (placeholder)
- **Precipitation**: 24-hour forecast probability
- **Visibility**: Distance with quality level
- **Pressure**: Trend chart with rising/falling indicator

### Technical Features
- 📦 **Single Codebase**: Works everywhere
- 🎨 **Responsive Design**: Mobile-first, works on all screen sizes
- 🔌 **Offline Support**: Service Worker caching
- ⚡ **Lightning Fast**: ~6KB gzipped bundle
- 🎯 **No Framework**: Pure vanilla JavaScript for maximum performance

## Tech Stack

- **Build Tool**: Vite
- **APIs**: 
  - Weather.gov (primary weather data)
  - RainViewer (animated radar)
  - IP-API.com (location detection)
  - OpenStreetMap (base maps)
- **PWA**: Service Workers, Web App Manifest

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start the development server at http://localhost:3000

### Build

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Configuration

### Auto-Refresh Interval

The default refresh interval is 15 minutes. You can change this in the Settings section of the widget (1-60 minutes).

### Weather Data Provider

Currently using Weather.gov API (US locations only). A placeholder exists for future WeatherAPI.com integration in `services/weather.js`.

### Detail Cards Customization

Edit `services/details.js` to customize:
- Wind speed color thresholds
- Humidity bar count and styling  
- Pressure trend thresholds
- UV index ranges
- Default fallback values

## API Data Sources

- **Weather.gov**: Primary weather data (current conditions, forecast)
  - Free, no API key required
  - US locations only
  - Rate limit: Reasonable use
  
- **RainViewer**: Animated radar maps
  - Free, no API key required
  - Global coverage
  - Historical + nowcast frames

- **IP-API.com**: Location detection
  - Free tier: 45 req/min
  - No API key for HTTP
  - City-level accuracy

- **OpenStreetMap**: Base map tiles
  - Free, no API key
  - Usage policy: Light use OK

## Weather Detail Widgets

The app includes 8 interactive detail cards that display:

1. **Temperature Card**: Current temperature with condition description
2. **Feels Like Card**: Wind chill or heat index with dominant factor
3. **Wind Card**: Animated compass showing wind direction and speed (color-coded)
4. **Humidity Card**: Visual bar chart showing relative humidity percentage
5. **UV Index Card**: Color-coded gauge from low to extreme (placeholder data)
6. **Precipitation Card**: 24-hour forecast probability
7. **Visibility Card**: Distance visibility with quality level (Poor to Excellent)
8. **Pressure Card**: Barometric pressure with trend chart and direction

### Wind Chill & Heat Index

The app calculates:
- **Wind Chill**: When temp ≤ 50°F and wind > 3mph (official NWS formula)
- **Heat Index**: When temp ≥ 80°F (accounts for humidity)
- Falls back to Weather.gov provided values when available

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Chrome OS (as installed PWA)

## Caching Strategy

- **Location Data**: Cached for 24 hours
- **Weather Data**: Cached for 15 minutes
- **Radar Frames**: Fetched on-demand, refreshed with weather data

## Future Enhancements

- [ ] WeatherAPI.com integration (global coverage)
- [ ] Weather alerts and notifications  
- [ ] Multiple location support
- [ ] Customizable themes / dark mode
- [ ] Extended forecast (10-day+)
- [ ] Historical weather data
- [ ] Weather charts and graphs
- [ ] Manual location entry
- [ ] Air quality index (AQI) integration
- [ ] Severe weather alerts
- [ ] Hourly forecast view
- [ ] Weather map layers (temperature, precipitation, wind)
- [ ] Export/share weather data
- [ ] Voice announcements for kiosk mode

## Known Limitations

- **Weather.gov**: US locations only (future: add WeatherAPI.com for global coverage)
- **IP Geolocation**: City-level accuracy (browser geolocation as fallback)
- **UV Index**: Currently using placeholder data (Weather.gov doesn't provide UV)
- **Humidity**: May not be available from all Weather.gov stations
- **Radar**: Simplified tile-based view (could enhance with full Leaflet/Mapbox)

## License

MIT
