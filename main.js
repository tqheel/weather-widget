import './style.css';
import { WeatherService } from './services/weather.js';
import { LocationService } from './services/location.js';
import { RadarService } from './services/radar.js';

class WeatherWidget {
  constructor() {
    this.weatherService = new WeatherService();
    this.locationService = new LocationService();
    this.radarService = null;
    this.refreshInterval = null;
    this.autoRefreshMinutes = 15;
    
    this.initializeElements();
    this.attachEventListeners();
    this.initialize();
  }

  initializeElements() {
    this.elements = {
      loading: document.getElementById('loading'),
      error: document.getElementById('error'),
      weatherContent: document.getElementById('weather-content'),
      locationName: document.getElementById('location-name'),
      temp: document.getElementById('temp'),
      conditions: document.getElementById('conditions'),
      wind: document.getElementById('wind'),
      forecastGrid: document.getElementById('forecast-grid'),
      radarMap: document.getElementById('radar-map'),
      radarPlay: document.getElementById('radar-play'),
      radarTimeline: document.getElementById('radar-timeline'),
      radarTime: document.getElementById('radar-time'),
      refreshBtn: document.getElementById('refresh-btn'),
      refreshIntervalInput: document.getElementById('refresh-interval')
    };
  }

  attachEventListeners() {
    this.elements.refreshBtn.addEventListener('click', () => this.refreshWeather());
    this.elements.refreshIntervalInput.addEventListener('change', (e) => {
      this.autoRefreshMinutes = parseInt(e.target.value);
      this.setupAutoRefresh();
    });
  }

  async initialize() {
    try {
      this.showLoading('Detecting location...');
      
      const location = await this.locationService.getLocation();
      console.log('Location detected:', location);
      
      await this.loadWeatherData(location);
      this.initializeRadar(location);
      this.setupAutoRefresh();
      
    } catch (error) {
      this.showError(`Failed to initialize: ${error.message}`);
      console.error('Initialization error:', error);
    }
  }

  async loadWeatherData(location) {
    try {
      this.showLoading('Loading weather data...');
      
      const weatherData = await this.weatherService.getWeather(location);
      console.log('Weather data:', weatherData);
      
      this.displayWeather(weatherData);
      this.hideLoading();
      
    } catch (error) {
      this.showError(`Failed to load weather: ${error.message}`);
      throw error;
    }
  }

  displayWeather(data) {
    this.elements.locationName.textContent = data.location.name;
    this.elements.temp.textContent = Math.round(data.current.temperature);
    this.elements.conditions.textContent = data.current.shortForecast;
    this.elements.wind.textContent = `Wind: ${data.current.windSpeed} ${data.current.windDirection}`;
    
    this.displayForecast(data.forecast);
  }

  displayForecast(forecast) {
    this.elements.forecastGrid.innerHTML = '';
    
    forecast.slice(0, 7).forEach(period => {
      const item = document.createElement('div');
      item.className = 'forecast-item';
      item.innerHTML = `
        <h4>${period.name}</h4>
        <div class="temp">${period.temperature}°${period.temperatureUnit}</div>
        <p>${period.shortForecast}</p>
        <p>Wind: ${period.windSpeed}</p>
      `;
      this.elements.forecastGrid.appendChild(item);
    });
  }

  initializeRadar(location) {
    this.radarService = new RadarService(location, this.elements.radarMap);
    
    this.elements.radarPlay.addEventListener('click', () => {
      this.radarService.toggleAnimation();
      this.elements.radarPlay.textContent = this.radarService.isPlaying ? '⏸ Pause' : '▶ Play';
    });
    
    this.elements.radarTimeline.addEventListener('input', (e) => {
      this.radarService.setFrame(parseInt(e.target.value));
    });
    
    this.radarService.on('frameChange', (frameIndex, timestamp) => {
      this.elements.radarTimeline.value = frameIndex;
      this.elements.radarTime.textContent = new Date(timestamp * 1000).toLocaleTimeString();
    });
    
    this.radarService.on('loaded', (frameCount) => {
      this.elements.radarTimeline.max = frameCount - 1;
    });
  }

  async refreshWeather() {
    try {
      const location = await this.locationService.getLocation();
      await this.loadWeatherData(location);
      if (this.radarService) {
        this.radarService.refresh();
      }
    } catch (error) {
      this.showError(`Refresh failed: ${error.message}`);
    }
  }

  setupAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    
    this.refreshInterval = setInterval(() => {
      this.refreshWeather();
    }, this.autoRefreshMinutes * 60 * 1000);
  }

  showLoading(message) {
    this.elements.loading.textContent = message;
    this.elements.loading.classList.remove('hidden');
    this.elements.error.classList.add('hidden');
    this.elements.weatherContent.classList.add('hidden');
  }

  hideLoading() {
    this.elements.loading.classList.add('hidden');
    this.elements.weatherContent.classList.remove('hidden');
  }

  showError(message) {
    this.elements.error.textContent = message;
    this.elements.error.classList.remove('hidden');
    this.elements.loading.classList.add('hidden');
  }
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered:', registration))
      .catch(error => console.log('SW registration failed:', error));
  });
}

// Initialize the widget when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new WeatherWidget();
});
