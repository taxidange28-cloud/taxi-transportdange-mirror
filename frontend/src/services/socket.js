import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://taxi-transportdange.onrender.com';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.pingInterval = null;
  }

  /**
   * Connect to Socket.io server with JWT token
   */
  connect() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn('No token available for socket connection');
      return;
    }

    if (this.socket?.connected) {
      console.log('🔌 Socket already connected');
      return;
    }

    console.log('🔌 Connexion WebSocket... ', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      timeout: 20000,
    });

    this.setupDefaultListeners();
  }

  /**
   * Setup default connection event listeners
   */
  setupDefaultListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connecté:', this.socket.id);
      this.startHeartbeat();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket déconnecté:', reason);
      this.stopHeartbeat();
      
      // Reconnexion automatique si le serveur coupe
      if (reason === 'io server disconnect') {
        setTimeout(() => {
          console.log('🔄 Tentative de reconnexion...');
          this.socket.connect();
        }, 1000);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erreur connexion WebSocket:', error.message);
    });

    this.socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnecté après ${attemptNumber} tentative(s)`);
      this.startHeartbeat();
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Tentative de reconnexion #${attemptNumber}...`);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Erreur de reconnexion:', error.message);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Reconnexion échouée après plusieurs tentatives');
    });

    // Réponse au pong du serveur
    this.socket.on('pong', () => {
      console.log('💚 Pong reçu du serveur');
    });
  }

  /**
   * Start heartbeat to keep connection alive
   */
  startHeartbeat() {
    // Arrêter l'ancien intervalle s'il existe
    this.stopHeartbeat();

    // ✅ MODIFICATION : Ping toutes les 5 minutes (300 secondes)
    this.pingInterval = setInterval(() => {
      if (this.socket?.connected) {
        console.log('💓 Ping WebSocket');
        this.socket.emit('ping');
      } else {
        console.warn('⚠️ WebSocket non connecté, arrêt du heartbeat');
        this.stopHeartbeat();
      }
    }, 300000); // ✅ 300 secondes = 5 minutes

    console.log('💓 Heartbeat démarré (ping toutes les 5 min)');
  }

  /**
   * Stop heartbeat
   */
  stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
      console.log('💔 Heartbeat arrêté');
    }
  }

  /**
   * Listen to a specific event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this.socket) {
      console.warn('Socket not connected. Call connect() first.');
      return;
    }

    this.socket.on(event, callback);
    
    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    if (!this.socket) return;

    this.socket.off(event, callback);
    
    // Remove from stored listeners
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit an event to the server
   * @param {string} event - Event name
   * @param {*} data - Data to send
   */
  emit(event, data) {
    if (!this.socket?.connected) {
      console.warn('⚠️ WebSocket non connecté, impossible d\'envoyer:', event);
      return;
    }

    this.socket.emit(event, data);
  }

  /**
   * Disconnect from socket server
   */
  disconnect() {
    this.stopHeartbeat();
    
    if (this.socket) {
      // Remove all custom listeners
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach((callback) => {
          this.socket.off(event, callback);
        });
      });
      this.listeners.clear();

      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 WebSocket déconnecté');
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected() {
    return this.socket?.connected || false;
  }

  /**
   * Setup mission event listeners
   * @param {Function} onNewMission - Callback for new mission
   * @param {Function} onConfirmedMission - Callback for confirmed mission
   * @param {Function} onAssignedMission - Callback for assigned mission
   * @param {Function} onModifiedMission - Callback for modified mission
   */
  setupMissionListeners({ 
    onNewMission, 
    onConfirmedMission, 
    onAssignedMission, 
    onModifiedMission 
  }) {
    if (onNewMission) {
      this.on('mission:nouvelle', onNewMission);
    }
    if (onConfirmedMission) {
      this.on('mission:confirmee', onConfirmedMission);
    }
    if (onAssignedMission) {
      this.on('mission:assignee', onAssignedMission);
    }
    if (onModifiedMission) {
      this.on('mission:modifiee', onModifiedMission);
    }
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
