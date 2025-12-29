# Weather Widget PWA

A Progressive Web App that displays real-time weather information with animated radar maps.

## Features

- **Auto Location Detection**: Uses IP-based geolocation to automatically detect your location
- **Real-time Weather Data**: Fetches current conditions and forecast from Weather.gov
- **Animated Radar**: Interactive weather radar using RainViewer API
- **Smart Caching**: API results cached for 15 minutes to reduce requests
- **User-Configurable Refresh**: Set custom auto-refresh intervals
- **PWA Support**: Installable on Chrome OS and runs as native app
- **Offline Support**: Service worker caches assets for offline functionality

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

The default refresh interval is 15 minutes. You can change this in the Settings section of the widget.

### Weather Data Provider

Currently using Weather.gov API. A placeholder exists for future WeatherAPI.com integration in `services/weather.js`.

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

- WeatherAPI.com integration as alternative data source
- Customizable themes
- Multiple location support
- Weather alerts and notifications
- Extended forecast (10-day+)

## License

MIT
