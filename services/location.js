// Location detection service using IP geolocation
export class LocationService {
  constructor() {
    this.cacheKey = 'weather-widget-location';
    this.cacheDuration = 24 * 60 * 60 * 1000; // 24 hours
  }

  async getLocation() {
    const cached = this.getCachedLocation();
    if (cached) {
      console.log('Using cached location');
      return cached;
    }

    try {
      // Try IP-based geolocation first
      const location = await this.getLocationFromIP();
      this.cacheLocation(location);
      return location;
    } catch (error) {
      console.error('IP geolocation failed:', error);
      
      // Fallback to browser geolocation if available
      if (navigator.geolocation) {
        return await this.getLocationFromBrowser();
      }
      
      throw new Error('Unable to detect location');
    }
  }

  async getLocationFromIP() {
    // Using ip-api.com for IP geolocation (free, no API key required)
    const response = await fetch('http://ip-api.com/json/?fields=status,message,lat,lon,city,region,country');
    
    if (!response.ok) {
      throw new Error('IP geolocation service unavailable');
    }

    const data = await response.json();
    
    if (data.status === 'fail') {
      throw new Error(data.message || 'IP geolocation failed');
    }

    return {
      latitude: data.lat,
      longitude: data.lon,
      city: data.city,
      region: data.region,
      country: data.country,
      name: `${data.city}, ${data.region}`
    };
  }

  async getLocationFromBrowser() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          // Reverse geocode to get city name
          try {
            const name = await this.reverseGeocode(location.latitude, location.longitude);
            location.name = name;
          } catch (error) {
            location.name = `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`;
          }
          
          resolve(location);
        },
        (error) => {
          reject(new Error('Browser geolocation denied or unavailable'));
        }
      );
    });
  }

  async reverseGeocode(lat, lon) {
    // Simple reverse geocoding using Nominatim (free, no API key)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    
    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }

    const data = await response.json();
    const address = data.address || {};
    
    return `${address.city || address.town || address.village || 'Unknown'}, ${address.state || address.country}`;
  }

  getCachedLocation() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;

      const { location, timestamp } = JSON.parse(cached);
      
      if (Date.now() - timestamp > this.cacheDuration) {
        localStorage.removeItem(this.cacheKey);
        return null;
      }

      return location;
    } catch (error) {
      return null;
    }
  }

  cacheLocation(location) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify({
        location,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to cache location:', error);
    }
  }
}
