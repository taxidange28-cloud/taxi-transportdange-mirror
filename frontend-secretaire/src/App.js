import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Geolocalisation from './pages/Geolocalisation';
import socketService from './services/socket';

// Vérifier si l'utilisateur est authentifié
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  })();

  if (!token || user.role !== 'secretaire') {
    return <Navigate to="/login" replace />;
  }

  // Connecter le WebSocket si pas encore fait
  if (token && !socketService.socket?.connected) {
    socketService.connect(token);
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/geolocalisation"
            element={
              <PrivateRoute>
                <Geolocalisation />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
