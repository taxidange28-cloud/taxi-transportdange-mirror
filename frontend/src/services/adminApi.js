import api from './api';

// Récupérer tous les utilisateurs (secrétaires + chauffeurs)
export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

// Créer un nouvel utilisateur
export const createUser = async (userData) => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

// Modifier un utilisateur
export const updateUser = async (userId, userData) => {
  const response = await api.put(`/admin/users/${userId}`, userData);
  return response.data;
};

// Changer le mot de passe d'un utilisateur
export const updateUserPassword = async (userId, newPassword, table) => {
  const response = await api.put(`/admin/users/${userId}/password`, { 
    newPassword, 
    table 
  });
  return response.data;
};

// Supprimer un utilisateur
export const deleteUser = async (userId, table) => {
  const response = await api.delete(`/admin/users/${userId}?table=${table}`);
  return response.data;
};

// Récupérer les statistiques globales
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};
