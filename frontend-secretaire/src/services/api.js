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

// Missions
export const getMissions = (filters = {}) => 
  api.get('/missions', { params: filters });

export const getMission = (id) => 
  api.get(`/missions/${id}`);

export const createMission = (data) => 
  api.post('/missions', data);

export const updateMission = (id, data) => 
  api.put(`/missions/${id}`, data);

export const deleteMission = (id) => 
  api.delete(`/missions/${id}`);

export const envoyerMission = (id) => 
  api.post(`/missions/${id}/envoyer`);

export const envoyerMissionsParDate = async (data) => {
  return api.post('/missions/envoyer-par-date', data);
};

export const ajouterCommentaire = (id, commentaire) => 
  api.post(`/missions/${id}/commentaire`, { commentaire });

// Chauffeurs
export const getChauffeurs = () => 
  api.get('/chauffeurs');

export const getMissionsChauffeur = (chauffeurId, filters = {}) => 
  api.get(`/chauffeurs/${chauffeurId}/missions`, { params: filters });

// Export
export const exportExcel = (debut, fin) => {
  return api.get('/export/excel', {
    params: { debut, fin },
    responseType: 'blob',
  });
};
export const getChauffeursManage = () =>
  api.get('/chauffeurs/manage');

export const createChauffeur = (data) =>
  api.post('/chauffeurs/manage', data);

export const updateChauffeur = (id, data) =>
  api.put(`/chauffeurs/manage/${id}`, data);

export const updateChauffeurPassword = (id, newPassword) =>
  api.put(`/chauffeurs/manage/${id}/password`, { newPassword });

export const deleteChauffeur = (id) =>
  api.delete(`/chauffeurs/manage/${id}`);
export default api;
