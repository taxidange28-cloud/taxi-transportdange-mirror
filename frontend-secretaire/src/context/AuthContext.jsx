import React, { createContext, useContext, useState, useEffect } from 'react';
import socketService from '../services/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // Connect socket when user is authenticated
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      // Vérifier si socketService est déjà connecté
      const isConnected = socketService.socket?.connected || false;
      if (token && !isConnected) {
        socketService.connect(token);
      }
    }

    return () => {
      // Cleanup: disconnect socket when component unmounts
      if (socketService.socket?.connected) {
        socketService.disconnect();
      }
    };
  }, [user]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData)); // Parse les données utilisateur si valides
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false); // Arrêter le chargement après la vérification
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    // Connect to socket when user logs in
    socketService.connect(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);

    // Disconnect socket when user logs out
    if (socketService.socket?.connected) {
      socketService.disconnect();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
