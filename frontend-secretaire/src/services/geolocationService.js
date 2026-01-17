import api from './api';
import socketService from './socket';

class GeolocationService {
  constructor() {
    this.positions = new Map();
    this.listeners = [];
  }

  initialize() {
    socketService.on('geolocation:update', (data) => {
      this.updatePosition(data);
    });

    socketService.on('geolocation:chauffeur-offline', (data) => {
      this.removePosition(data.chauffeur_id);
    });

    this.loadActivePositions();

    setInterval(() => {
      this.loadActivePositions();
    }, 60000);
  }

  async loadActivePositions() {
    try {
      const response = await api.get('/geolocation/active');
      response.data.positions.forEach(pos => {
        this.updatePosition(pos);
      });
    } catch (error) {
      console.error('Error loading positions:', error);
    }
  }

  updatePosition(data) {
    const position = {
      chauffeur_id: data.chauffeur_id,
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy,
      timestamp: new Date(data.timestamp),
      chauffeur_nom: data.chauffeur_nom,
      chauffeur_username: data.chauffeur_username,
    };

    this.positions.set(data.chauffeur_id, position);
    this.notifyListeners();
  }

  removePosition(chauffeurId) {
    this.positions.delete(chauffeurId);
    this.notifyListeners();
  }

  getAllPositions() {
    return Array.from(this.positions.values());
  }

  getPosition(chauffeurId) {
    return this.positions.get(chauffeurId);
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      callback(this.getAllPositions());
    });
  }

  async getChauffeurHistory(chauffeurId, limit = 50) {
    try {
      const response = await api.get(`/geolocation/history/${chauffeurId}`, {
        params: { limit }
      });
      return response.data.history;
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  }

  disconnect() {
    socketService.off('geolocation:update');
    socketService.off('geolocation:chauffeur-offline');
    this.positions.clear();
    this.listeners = [];
  }
}

const geolocationService = new GeolocationService();
export default geolocationService;
