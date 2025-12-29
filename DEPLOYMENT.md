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

## GitHub Pages Deployment (Recommended)

The project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

**Setup (One-time):**

1. Go to your repository on GitHub: https://github.com/tqheel/weather-widget
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. That's it! 

**Every time you push to the `master` branch:**
- GitHub Actions automatically builds the project
- Deploys to GitHub Pages
- Your site will be live at: https://tqheel.github.io/weather-widget/

**Check deployment status:**
- Go to **Actions** tab in your GitHub repository
- View the "Deploy to GitHub Pages" workflow
- Green checkmark = successful deployment

### Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Build the project
npm run build

# Deploy using gh-pages package
npm install -g gh-pages
gh-pages -d dist
```

**Your site will be at:** https://tqheel.github.io/weather-widget/

## Other Deployment Options

### 1. Netlify

**Via Netlify CLI:**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

**Via Netlify UI:**
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy!

### 2. Vercel

```bash
npm install -g vercel
npm run build
vercel --prod
```

**Or connect via Vercel dashboard:**
1. Import your GitHub repository
2. Framework: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

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

### 4. Chrome OS Kiosk Mode

**Local deployment:**
```bash
npm run dev
google-chrome --kiosk --app=http://localhost:3000
```

**Production deployment:**
```bash
google-chrome --kiosk --app=https://tqheel.github.io/weather-widget/
```

## Configuration

### Base URL

The project is configured for GitHub Pages with base URL `/weather-widget/`.

If deploying elsewhere, update `vite.config.js`:

```javascript
export default defineConfig({
  base: '/',  // For root domain
  // or
  base: '/your-path/',  // For subdirectory
  ...
});
```

### Environment Variables

Create `.env` file for custom configuration:

```env
# Future: WeatherAPI.com key
VITE_WEATHERAPI_KEY=your_key_here

# Custom API endpoints (optional)
VITE_WEATHER_API_BASE=https://api.weather.gov
```

## PWA Installation

The app is installable as a PWA when served over HTTPS:

**GitHub Pages:** ✅ Automatic HTTPS
**Netlify/Vercel:** ✅ Automatic HTTPS
**Custom domain:** Configure SSL certificate

Users can then:
1. Install from browser (Chrome, Edge, Safari on iOS)
2. Add to home screen (mobile)
3. Run as standalone app

## CORS Considerations

All APIs used are CORS-friendly:
- ✅ Weather.gov API - No CORS issues
- ✅ RainViewer - No CORS issues
- ⚠️ IP-API.com - HTTP works for testing, HTTPS for production

**For production with HTTPS:**
Update `services/location.js` line 33:
```javascript
const response = await fetch('https://ip-api.com/json/...');
// Change from http:// to https://
```

Note: HTTPS version of ip-api.com requires a paid plan. For free tier, you can:
1. Use browser geolocation as primary (more accurate anyway)
2. Set a default location
3. Allow users to enter location manually

## Monitoring

**GitHub Pages:**
- View deployment logs in Actions tab
- Check Pages settings for deployment status
- Monitor via GitHub status page

**Performance:**
- Lighthouse score in Chrome DevTools
- Bundle analyzer: `npm run build -- --mode analyze`
- Network tab to check API response times

## Updates

**GitHub Pages (automatic):**
```bash
git add .
git commit -m "Update message"
git push origin master
# GitHub Actions deploys automatically
```

**Manual deployments:**
```bash
npm run build
# Then deploy using your chosen method
```

The service worker will automatically update clients on next visit.

## Troubleshooting

**Deployment fails:**
- Check GitHub Actions logs for errors
- Verify `package.json` has all dependencies
- Ensure Node version matches (20.x recommended)

**404 errors on GitHub Pages:**
- Verify `base` in `vite.config.js` matches repo name
- Check that GitHub Pages source is set to "GitHub Actions"
- Wait a few minutes after deployment

**PWA not installing:**
- Must be served over HTTPS
- Check manifest.json is accessible
- Verify service worker is registered (check DevTools → Application)

**API errors:**
- Weather.gov works only for US locations
- Check browser console for CORS errors
- Verify network access to APIs

## Security Notes

- All API keys should be in environment variables
- Never commit `.env` to version control
- GitHub Pages is public - don't store secrets
- Use HTTPS in production for PWA features
- Rate limit API calls to avoid quotas

## Performance Tips

**For faster deployments:**
- Use `npm ci` instead of `npm install` (in CI)
- Enable caching in GitHub Actions (already configured)
- Minimize bundle size with code splitting if needed

**For better user experience:**
- Set proper cache headers (automatic with GitHub Pages)
- Enable service worker caching (already implemented)
- Use CDN if high traffic expected (Netlify/Vercel provide this)
