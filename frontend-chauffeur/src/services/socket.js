import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
    this.pingInterval = null;
  }

  connect(token) {
    if (this.socket?.connected) {
      console.log('🔌 WebSocket déjà connecté');
      return;
    }

    console.log('🔌 Connexion WebSocket... ', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      timeout: 20000,
    });

    this.setupListeners();
  }

  setupListeners() {
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

    // Restaurer les listeners
    Object.keys(this.listeners).forEach((event) => {
      this.listeners[event].forEach((callback) => {
        this.socket.on(event, callback);
      });
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

    console.log('💓 Heartbeat démarré (ping toutes les 5 min)'); // ✅ Message mis à jour
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

  disconnect() {
    this.stopHeartbeat();

    if (this.socket) {
      console.log('🔌 Déconnexion WebSocket');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ WebSocket non connecté, impossible d\'envoyer:', event);
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

const socketService = new SocketService();
export default socketService;
