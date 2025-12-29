// RainViewer radar service for animated weather radar
export class RadarService {
  constructor(location, mapElement) {
    this.location = location;
    this.mapElement = mapElement;
    this.frames = [];
    this.currentFrame = 0;
    this.isPlaying = false;
    this.animationInterval = null;
    this.eventHandlers = {};
    
    this.initialize();
  }

  async initialize() {
    await this.loadRadarFrames();
    this.setupMap();
  }

  async loadRadarFrames() {
    try {
      // Fetch available radar timestamps from RainViewer
      const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
      
      if (!response.ok) {
        throw new Error('Failed to fetch radar data');
      }

      const data = await response.json();
      
      // Get the last 10 radar frames
      this.frames = data.radar.past.slice(-10).concat(data.radar.nowcast);
      this.apiHost = data.host;
      
      this.emit('loaded', this.frames.length);
      
      if (this.frames.length > 0) {
        this.setFrame(this.frames.length - 1); // Show most recent
      }
      
    } catch (error) {
      console.error('Failed to load radar frames:', error);
      this.mapElement.innerHTML = '<div style="padding: 20px; text-align: center;">Radar data unavailable</div>';
    }
  }

  setupMap() {
    // Create a simple map using Leaflet-style tiles
    this.mapElement.innerHTML = `
      <div style="width: 100%; height: 100%; position: relative;">
        <div id="base-map" style="width: 100%; height: 100%; background: #e5e7eb;"></div>
        <canvas id="radar-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></canvas>
      </div>
    `;

    // Initialize simple tile-based map
    this.initializeBaseMap();
  }

  initializeBaseMap() {
    const baseMap = this.mapElement.querySelector('#base-map');
    
    // Calculate tile coordinates for the location
    const zoom = 8;
    const lat = this.location.latitude;
    const lon = this.location.longitude;
    
    // Simple map display with OpenStreetMap tiles
    const tileX = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
    const tileY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    
    // Create a simple grid of tiles centered on location
    let tilesHTML = '<div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); width: 100%; height: 100%;">';
    
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const x = tileX + dx;
        const y = tileY + dy;
        tilesHTML += `<div style="background-image: url('https://tile.openstreetmap.org/${zoom}/${x}/${y}.png'); background-size: 100% 100%; background-repeat: no-repeat;"></div>`;
      }
    }
    
    tilesHTML += '</div>';
    baseMap.innerHTML = tilesHTML;
    
    // Add radar overlay
    this.updateRadarOverlay();
  }

  updateRadarOverlay() {
    if (this.frames.length === 0) return;
    
    const canvas = this.mapElement.querySelector('#radar-overlay');
    if (!canvas) return;
    
    const frame = this.frames[this.currentFrame];
    const radarURL = `${this.apiHost}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`;
    
    // Calculate tile coordinates for radar overlay
    const zoom = 8;
    const lat = this.location.latitude;
    const lon = this.location.longitude;
    const tileX = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
    const tileY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    
    // Set canvas size
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.6;
    
    // Load 3x3 grid of radar tiles
    const tileSize = 256;
    const gridSize = canvas.width / 3;
    let loadedTiles = 0;
    const totalTiles = 9;
    
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const x = tileX + dx;
        const y = tileY + dy;
        const radarTileURL = radarURL.replace('{z}', zoom).replace('{x}', x).replace('{y}', y);
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const destX = (dx + 1) * gridSize;
          const destY = (dy + 1) * gridSize;
          ctx.drawImage(img, destX, destY, gridSize, gridSize);
          loadedTiles++;
        };
        img.onerror = () => {
          loadedTiles++;
        };
        img.src = radarTileURL;
      }
    }
  }

  setFrame(index) {
    if (index < 0 || index >= this.frames.length) return;
    
    this.currentFrame = index;
    this.updateRadarOverlay();
    
    const frame = this.frames[index];
    this.emit('frameChange', index, frame.time);
  }

  toggleAnimation() {
    if (this.isPlaying) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  }

  startAnimation() {
    this.isPlaying = true;
    
    this.animationInterval = setInterval(() => {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      this.setFrame(this.currentFrame);
    }, 500); // 500ms per frame
  }

  stopAnimation() {
    this.isPlaying = false;
    
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  async refresh() {
    this.stopAnimation();
    await this.loadRadarFrames();
  }

  on(event, handler) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  emit(event, ...args) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => handler(...args));
    }
  }
}
