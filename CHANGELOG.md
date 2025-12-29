# Changelog

All notable changes to the Weather Widget PWA project will be documented in this file.

## [Unreleased]

### Added (2024-12-29)
- **Weather Detail Cards**: Added 8 interactive MSN Weather-style detail widgets
  - Temperature card with current conditions
  - Feels Like card with wind chill/heat index calculation
  - Wind card with animated compass showing direction and speed
  - Humidity card with visual bar chart and dew point
  - UV Index card with color-coded gauge (placeholder data)
  - Precipitation card showing 24-hour forecast probability
  - Visibility card with distance and quality level indicators
  - Pressure card with trend chart and rising/falling indicators
- **Enhanced Weather Data**: Extended Weather.gov API integration
  - Added wind speed value, wind gust data
  - Added dew point temperature
  - Added barometric pressure with trend analysis
  - Added visibility distance
  - Added cloud cover information
- **Wind Chill Calculation**: Implemented official NWS wind chill formula for temps ≤50°F
- **Heat Index Calculation**: Implemented official heat index formula for temps ≥80°F
- **Feels Like Temperature**: Added to main temperature display
- **Animated Visualizations**: 
  - Canvas-based wind compass with color-coded speed indicators
  - Dynamic pressure trend chart
  - Animated humidity and visibility bars
- **New Service**: Created `services/details.js` for managing detail widgets
- **PWA Icons**: Added favicon.svg and updated manifest.json

### Fixed (2024-12-29)
- Fixed radar map display stretching (added proper grid-template-rows)
- Fixed radar overlay to show full 3x3 tile grid instead of single tile
- Fixed null/NaN value handling in detail cards
- Fixed wind speed and humidity fallback values
- Fixed feels-like temperature display logic (only shows when difference ≥3°F)
- Added comprehensive error handling for missing API data

### Changed (2024-12-29)
- Improved data caching with extended Weather.gov API fields
- Enhanced temperature display with contextual information
- Updated gradient blue card design matching MSN Weather aesthetic
- Improved responsive layout for detail cards
- Updated manifest.json to use scalable SVG icons

## [1.0.0] - 2024-12-29

### Initial Release
- Progressive Web App architecture
- Auto location detection via IP geolocation
- Weather.gov API integration with 15-minute caching
- RainViewer animated radar map
- User-configurable auto-refresh intervals
- 7-day forecast display
- Service Worker for offline support
- Built with Vite + Vanilla JavaScript
- Fully responsive design
- Chrome OS kiosk mode support

### Features
- Real-time weather data from Weather.gov (US locations)
- Animated weather radar with play/pause controls
- Location-based weather using ip-api.com
- Caching strategy: 15 minutes for weather, 24 hours for location
- Manual refresh capability
- Settings panel for customization

### Technical Stack
- Build Tool: Vite 5.0+
- Language: Vanilla JavaScript (ES Modules)
- APIs: Weather.gov, RainViewer, IP-API.com, OpenStreetMap
- PWA: Service Workers, Web App Manifest
- Styling: Pure CSS with responsive design
