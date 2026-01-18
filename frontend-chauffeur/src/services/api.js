import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Créer une instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (username, password) => 
  api.post('/auth/login', { username, password });

export const logout = () => 
  api.post('/auth/logout');

export const getMe = () => 
  api.get('/auth/me');

// Missions chauffeur
export const getMissionsChauffeur = (chauffeurId, filters = {}) => 
  api.get(`/chauffeurs/${chauffeurId}/missions`, { params: filters });

export const confirmerMission = (missionId) => 
  api.post(`/missions/${missionId}/confirmer`);

export const priseEnCharge = (missionId) => 
  api.post(`/missions/${missionId}/pec`);

export const terminerMission = (missionId) => 
  api.post(`/missions/${missionId}/terminer`);

export const ajouterCommentaire = (missionId, commentaire) => 
  api.post(`/missions/${missionId}/commentaire`, { commentaire });

// Géolocalisation
export const envoyerPosition = async (latitude, longitude, precision = null) => {
  const response = await api.post('/geolocation/position', {
    latitude,
    longitude,
    precision,
  });
  return response.data;
};

// Chauffeurs - Enregistrement token FCM
export const enregistrerFcmToken = (chauffeurId, fcmToken) => 
  api.post(`/chauffeurs/${chauffeurId}/fcm-token`, { fcmToken });

export default api;
