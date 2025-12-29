# Deployment Guide

## Quick Start

```bash
# Install dependencies
npm install

# Development mode
npm run dev
# Opens at http://localhost:3000

# Production build
npm run build
# Output: dist/

# Preview production build
npm run preview
```

## Deployment Options

### 1. Chrome OS (Recommended for Kiosk Mode)

**Install as PWA:**
1. Open the app URL in Chrome
2. Click the install icon in the address bar (or menu → "Install Weather Widget")
3. Launch from Chrome apps or create a kiosk shortcut

**Kiosk Mode Setup:**
```bash
# Launch in kiosk mode
google-chrome --kiosk --app=http://localhost:3000
```

For permanent kiosk:
- Use Chrome OS Kiosk Apps management
- Set the PWA as the kiosk app
- Configure auto-launch on boot

### 2. Static Hosting (Netlify, Vercel, GitHub Pages)

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**GitHub Pages:**
```bash
# Build
npm run build

# Push dist/ to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

### 3. Self-Hosted

Serve the `dist/` directory with any web server:

**Python:**
```bash
cd dist
python3 -m http.server 8000
```

**Node.js:**
```bash
npx serve dist
```

**Nginx:**
```nginx
server {
    listen 80;
    server_name weather.example.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Configuration

### Environment Variables

Create `.env` file for custom configuration:

```env
# Future: WeatherAPI.com key
VITE_WEATHERAPI_KEY=your_key_here

# Custom API endpoints (optional)
VITE_WEATHER_API_BASE=https://api.weather.gov
```

### Kiosk Settings

Edit `index.html` to set default values:
- Refresh interval (line with `value="15"`)
- Initial theme/display settings

### CORS Considerations

If deploying to a domain different from localhost:
- Weather.gov API: No CORS issues
- IP-API.com: May need to use HTTPS version for production
- RainViewer: No CORS issues

For production, consider:
1. Using HTTPS for all API calls
2. Implementing a backend proxy for sensitive APIs
3. Rate limiting to prevent API quota exhaustion

## PWA Installation

The app is installable as a PWA when served over HTTPS. Users can:
1. Install from browser (Chrome, Edge, Safari on iOS)
2. Add to home screen (mobile)
3. Run as standalone app

## Monitoring

Recommended monitoring for production:
- API rate limits (Weather.gov, RainViewer)
- Cache hit rates
- Location detection failures
- Service worker updates

## Updates

To update the deployed app:
```bash
# Pull latest changes
git pull

# Rebuild
npm run build

# Redeploy (depends on hosting platform)
# The service worker will automatically update clients
```

## Troubleshooting

**Location detection fails:**
- Check browser console for errors
- Verify network access to ip-api.com
- Fallback to manual location entry (future feature)

**Weather data not loading:**
- Weather.gov API only works for US locations
- Check API status at status.weather.gov
- Review browser console for CORS errors

**Radar not animating:**
- Check RainViewer API status
- Verify network access
- Check browser console for loading errors

## Security Notes

- All API keys should be stored in environment variables
- Never commit `.env` to version control
- Consider rate limiting for public deployments
- Use HTTPS in production for PWA features
