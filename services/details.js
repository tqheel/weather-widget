// Weather details widget manager
export class WeatherDetailsManager {
  constructor(elements) {
    this.elements = elements;
  }

  update(weatherData) {
    const current = weatherData.current;
    
    try {
      this.updateTemperature(current);
      this.updateFeelsLike(current);
      this.updateWind(current);
      this.updateHumidity(current);
      this.updateUV();
      this.updatePrecipitation(weatherData.forecast);
      this.updateVisibility(current);
      this.updatePressure(current);
      
      console.log('✅ Detail cards updated successfully');
    } catch (error) {
      console.error('❌ Error updating detail cards:', error);
    }
  }

  updateTemperature(current) {
    if (!this.elements.detailTemp) return;
    
    const temp = current.temperature || 0;
    this.elements.detailTemp.textContent = `${Math.round(temp)}°`;
    this.elements.detailTempTrend.textContent = current.shortForecast || 'Current temperature';
  }

  updateFeelsLike(current) {
    if (!this.elements.detailFeels) return;
    
    const feelsLike = current.feelsLike || current.temperature || 0;
    this.elements.detailFeels.textContent = `${Math.round(feelsLike)}°`;
    
    const diff = (current.temperature || 0) - feelsLike;
    let factor = 'Similar to actual temperature';
    if (diff > 3) {
      factor = 'Dominant factor: wind';
    } else if (diff < -3) {
      factor = 'Dominant factor: humidity';
    }
    this.elements.detailFeelsInfo.textContent = factor;
  }

  updateWind(current) {
    if (!this.elements.detailWindSpeed) return;
    
    const windSpeed = current.windSpeedValue || 0;
    this.elements.detailWindSpeed.textContent = `${Math.round(windSpeed)} mph`;
    
    if (current.windGust) {
      this.elements.detailWindGust.textContent = `Gusts: ${current.windGust} mph`;
    } else {
      this.elements.detailWindGust.textContent = 'Wind Speed';
    }
    
    // Draw wind compass
    this.drawWindCompass(current.windDirectionDegrees, windSpeed);
  }

  drawWindCompass(degrees, speed) {
    const canvas = document.getElementById('wind-compass');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = 50;
    const centerY = 50;
    const radius = 40;
    
    ctx.clearRect(0, 0, 100, 100);
    
    // Draw compass circle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw cardinal directions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', centerX, centerY - radius - 8);
    ctx.fillText('S', centerX, centerY + radius + 8);
    ctx.fillText('E', centerX + radius + 8, centerY);
    ctx.fillText('W', centerX - radius - 8, centerY);
    
    // Draw wind arrow
    const angleRad = (degrees - 90) * Math.PI / 180;
    const arrowLength = radius * 0.7;
    const arrowX = centerX + Math.cos(angleRad) * arrowLength;
    const arrowY = centerY + Math.sin(angleRad) * arrowLength;
    
    // Speed-based color
    let color = '#22c55e';
    if (speed > 20) color = '#f97316';
    else if (speed > 10) color = '#eab308';
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(arrowX, arrowY);
    ctx.stroke();
    
    // Arrow head
    const headSize = 8;
    const headAngle = Math.PI / 6;
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(
      arrowX - headSize * Math.cos(angleRad - headAngle),
      arrowY - headSize * Math.sin(angleRad - headAngle)
    );
    ctx.lineTo(
      arrowX - headSize * Math.cos(angleRad + headAngle),
      arrowY - headSize * Math.sin(angleRad + headAngle)
    );
    ctx.closePath();
    ctx.fill();
  }

  updateHumidity(current) {
    if (!this.elements.detailHumidity) return;
    
    const humidity = current.humidity !== null && current.humidity !== undefined ? current.humidity : 50; // Default to 50% if unavailable
    this.elements.detailHumidity.textContent = `${humidity}%`;
    
    if (current.dewpoint && !isNaN(current.dewpoint)) {
      this.elements.detailDewpoint.textContent = `Dew point: ${Math.round(current.dewpoint)}°`;
    } else {
      this.elements.detailDewpoint.textContent = humidity === 50 ? 'Data unavailable' : 'Relative Humidity';
    }
    
    // Draw humidity bars
    const container = document.getElementById('humidity-bars');
    if (!container) return;
    
    container.innerHTML = '';
    const barCount = 12;
    const activeCount = Math.round((humidity / 100) * barCount);
    
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'humidity-bar';
      if (i < activeCount) bar.classList.add('active');
      bar.style.height = `${20 + Math.random() * 40}px`;
      container.appendChild(bar);
    }
  }

  updateUV() {
    if (!this.elements.detailUV) return;
    
    // UV data not available from Weather.gov, use placeholder
    const uvIndex = 1; // Low for now
    this.elements.detailUV.textContent = uvIndex.toString();
    this.elements.detailUVLevel.textContent = 'Low';
    
    // Position UV indicator
    const indicator = document.getElementById('uv-indicator');
    if (indicator) {
      const percentage = Math.min(uvIndex / 11, 1) * 100;
      indicator.style.left = `${percentage}%`;
    }
  }

  updatePrecipitation(forecast) {
    if (!this.elements.detailPrecip) return;
    
    // Check forecast for precipitation probability
    let maxPrecip = 0;
    if (forecast && forecast.length > 0) {
      const next24h = forecast.slice(0, 2);
      next24h.forEach(period => {
        const prob = period.probabilityOfPrecipitation?.value || 0;
        maxPrecip = Math.max(maxPrecip, prob);
      });
    }
    
    if (maxPrecip > 0) {
      this.elements.detailPrecip.textContent = `${maxPrecip}%`;
    } else {
      this.elements.detailPrecip.textContent = '0 in';
    }
    
    // Draw precipitation gauge
    const gauge = document.getElementById('precip-gauge');
    if (gauge) {
      gauge.textContent = maxPrecip > 0 ? `${maxPrecip}%` : '0';
      if (maxPrecip > 0) {
        const hue = 200 - (maxPrecip / 100 * 80);
        gauge.style.borderColor = `hsl(${hue}, 70%, 60%)`;
      }
    }
  }

  updateVisibility(current) {
    if (!this.elements.detailVisibility) return;
    
    const visibility = parseFloat(current.visibility) || 10;
    this.elements.detailVisibility.textContent = `${visibility} mi`;
    
    let level = 'Excellent';
    if (visibility < 3) level = 'Poor';
    else if (visibility < 6) level = 'Moderate';
    else if (visibility < 10) level = 'Good';
    
    this.elements.detailVisibilityLevel.textContent = level;
    
    // Draw visibility bars
    const container = document.getElementById('visibility-bars');
    if (!container) return;
    
    container.innerHTML = '';
    const barCount = 5;
    const activeCount = Math.min(Math.ceil((visibility / 10) * barCount), barCount);
    
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'visibility-bar';
      if (i < activeCount) {
        bar.style.setProperty('--width', '100%');
      } else {
        bar.style.setProperty('--width', '0%');
      }
      bar.innerHTML = `<div style="width: var(--width, 0%); height: 100%; background: linear-gradient(90deg, #22c55e 0%, #3b82f6 100%); border-radius: 3px; transition: width 0.5s ease;"></div>`;
      container.appendChild(bar);
    }
  }

  updatePressure(current) {
    if (!this.elements.detailPressure) return;
    
    const pressure = parseFloat(current.pressure) || 29.92;
    this.elements.detailPressure.textContent = `${pressure} in`;
    
    let trend = 'Steady';
    if (pressure < 29.80) trend = 'Falling ↓';
    else if (pressure > 30.20) trend = 'Rising ↑';
    
    this.elements.detailPressureTrend.textContent = trend;
    
    // Draw simple pressure chart
    this.drawPressureChart(pressure);
  }

  drawPressureChart(currentPressure) {
    const canvas = document.getElementById('pressure-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = 120;
    const height = 40;
    
    ctx.clearRect(0, 0, width, height);
    
    // Simulate a simple trend line
    const points = [];
    const baseValue = currentPressure - 0.1;
    for (let i = 0; i < 10; i++) {
      const variance = (Math.random() - 0.5) * 0.05;
      points.push(baseValue + variance + (i / 9) * 0.2);
    }
    
    // Normalize to canvas height
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 0.1;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    points.forEach((value, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 10) - 5;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Add current point
    const lastX = width;
    const lastY = height - ((points[points.length - 1] - min) / range) * (height - 10) - 5;
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
