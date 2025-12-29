# Quick Start Guide

## 🚀 Get Running in 60 Seconds

```bash
cd /tmp/weather-widget
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## 📱 Install as PWA (Chrome OS)

1. Visit the running app in Chrome
2. Click the install icon (⊕) in the address bar
3. Click "Install"
4. Launch from Chrome apps

## 🖥️ Kiosk Mode

```bash
# Auto-starts app in fullscreen kiosk mode
google-chrome --kiosk --app=http://localhost:3000
```

## 🌍 Deploy to Production

### Option 1: Netlify (Easiest)
```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

### Option 2: Vercel
```bash
npm run build
npx vercel --prod
```

### Option 3: GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

## ⚙️ Customize Settings

### Change Default Refresh Interval
Edit `index.html` line 42:
```html
<input type="number" id="refresh-interval" min="1" max="60" value="15">
                                                               ^^
                                                               Change this
```

### Modify Cache Duration
Edit `services/weather.js` line 4:
```javascript
this.cacheDuration = 15 * 60 * 1000; // 15 minutes
                     ^^
                     Change this
```

### Switch to WeatherAPI.com (Future)
1. Get API key from weatherapi.com
2. Uncomment WeatherAPIService in `services/weather.js`
3. Replace WeatherService initialization in `main.js`

## 🐛 Troubleshooting

**"Location detection failed"**
- Check internet connection
- Try allowing browser location access
- API may be temporarily down

**"Weather data not loading"**
- Weather.gov only works for US locations
- Check browser console for errors
- Try refreshing the page

**"Radar not showing"**
- RainViewer API may be slow
- Check browser console for errors
- Network may be blocking external images

## 📖 More Information

- Full documentation: `README.md`
- Deployment guide: `DEPLOYMENT.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`

## 🎯 What's Included

✅ Auto location detection (IP-based)
✅ Current weather + 7-day forecast
✅ Animated weather radar
✅ 15-minute data caching
✅ User-configurable refresh
✅ PWA / Chrome OS ready
✅ Kiosk mode compatible
✅ Mobile responsive

Built with Vite + Vanilla JS + Weather.gov + RainViewer
