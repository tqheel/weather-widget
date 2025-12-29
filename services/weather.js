// Weather service using Weather.gov API with caching
export class WeatherService {
  constructor() {
    this.cacheKey = 'weather-widget-data';
    this.cacheDuration = 15 * 60 * 1000; // 15 minutes
    this.baseURL = 'https://api.weather.gov';
  }

  async getWeather(location) {
    const cached = this.getCachedWeather(location);
    if (cached) {
      console.log('Using cached weather data');
      return cached;
    }

    try {
      const weatherData = await this.fetchWeatherData(location);
      this.cacheWeather(location, weatherData);
      return weatherData;
    } catch (error) {
      console.error('Weather fetch error:', error);
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }

  async fetchWeatherData(location) {
    // Step 1: Get the grid point for this location
    const pointsURL = `${this.baseURL}/points/${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`;
    
    const pointsResponse = await fetch(pointsURL, {
      headers: {
        'User-Agent': 'WeatherWidget/1.0'
      }
    });

    if (!pointsResponse.ok) {
      throw new Error(`Weather.gov API error: ${pointsResponse.status}`);
    }

    const pointsData = await pointsResponse.json();
    const properties = pointsData.properties;

    // Step 2: Fetch current observations and forecast
    const [observationsData, forecastData] = await Promise.all([
      this.fetchObservations(properties.observationStations),
      this.fetchForecast(properties.forecast)
    ]);

    return {
      location: {
        ...location,
        gridId: properties.gridId,
        gridX: properties.gridX,
        gridY: properties.gridY
      },
      current: observationsData,
      forecast: forecastData
    };
  }

  async fetchObservations(stationsURL) {
    // Get the list of observation stations
    const stationsResponse = await fetch(stationsURL, {
      headers: {
        'User-Agent': 'WeatherWidget/1.0'
      }
    });

    if (!stationsResponse.ok) {
      throw new Error('Failed to fetch observation stations');
    }

    const stationsData = await stationsResponse.json();
    const stationId = stationsData.features[0]?.id;

    if (!stationId) {
      throw new Error('No observation station found');
    }

    // Get latest observation from the first station
    const obsResponse = await fetch(`${stationId}/observations/latest`, {
      headers: {
        'User-Agent': 'WeatherWidget/1.0'
      }
    });

    if (!obsResponse.ok) {
      throw new Error('Failed to fetch current observations');
    }

    const obsData = await obsResponse.json();
    const props = obsData.properties;

    return {
      temperature: this.celsiusToFahrenheit(props.temperature.value),
      temperatureUnit: 'F',
      description: props.textDescription || 'N/A',
      shortForecast: props.textDescription || 'N/A',
      windSpeed: props.windSpeed.value ? `${Math.round(props.windSpeed.value * 0.621371)} mph` : 'Calm',
      windDirection: props.windDirection.value ? this.degreesToDirection(props.windDirection.value) : '',
      humidity: props.relativeHumidity.value ? Math.round(props.relativeHumidity.value) : null,
      timestamp: props.timestamp
    };
  }

  async fetchForecast(forecastURL) {
    const response = await fetch(forecastURL, {
      headers: {
        'User-Agent': 'WeatherWidget/1.0'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch forecast');
    }

    const data = await response.json();
    return data.properties.periods || [];
  }

  celsiusToFahrenheit(celsius) {
    if (celsius === null || celsius === undefined) return null;
    return (celsius * 9/5) + 32;
  }

  degreesToDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  getCachedWeather(location) {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;

      const { data, timestamp, cachedLocation } = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - timestamp > this.cacheDuration) {
        localStorage.removeItem(this.cacheKey);
        return null;
      }

      // Check if location matches (within ~0.01 degrees)
      if (Math.abs(cachedLocation.latitude - location.latitude) > 0.01 ||
          Math.abs(cachedLocation.longitude - location.longitude) > 0.01) {
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Failed to retrieve cached weather:', error);
      return null;
    }
  }

  cacheWeather(location, data) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
        cachedLocation: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      }));
    } catch (error) {
      console.warn('Failed to cache weather data:', error);
    }
  }
}

// Placeholder for future WeatherAPI.com integration
export class WeatherAPIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.weatherapi.com/v1';
    // TODO: Implement WeatherAPI.com integration
  }

  async getWeather(location) {
    throw new Error('WeatherAPI.com integration not yet implemented');
  }
}
