import socketService from './socket';
import api from './api';

class LocationService {
  constructor() {
    this.updateInterval = null;
    this.lastPosition = null;
    this.isActive = false;
    this.UPDATE_FREQUENCY = 30000;
  }

  startTracking(onPositionUpdate) {
    if (this.isActive) {
      console.log('Tracking already active');
      return;
    }

    this.isActive = true;
    
    this.updateInterval = setInterval(() => {
      if (this.lastPosition) {
        this.sendPosition(this.lastPosition);
      }
    }, this.UPDATE_FREQUENCY);

    console.log('Location tracking started');
  }

  updatePosition(position) {
    this.lastPosition = position;

    if (this.isActive) {
      socketService.emit('geolocation:update', {
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
        speed: position.speed,
        heading: position.heading,
        timestamp: position.timestamp,
      });
    }
  }

  async sendPosition(position) {
    try {
      await api.post('/geolocation/update', {
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
        speed: position.speed,
        heading: position.heading,
      });
    } catch (error) {
      console.error('Error sending position:', error);
    }
  }

  stopTracking() {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    this.notifyDisconnect();
    
    console.log('Location tracking stopped');
  }

  async notifyDisconnect() {
    try {
      await api.post('/geolocation/disconnect');
      socketService.emit('geolocation:chauffeur-offline');
    } catch (error) {
      console.error('Error notifying disconnect:', error);
    }
  }

  isTracking() {
    return this.isActive;
  }
}

const locationService = new LocationService();
export default locationService;
