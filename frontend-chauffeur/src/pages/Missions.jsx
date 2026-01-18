import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Alert,
  Snackbar,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ListeMissions from '../components/ListeMissions';
import { getMissionsChauffeur } from '../services/api';
import socketService from '../services/socket';
import { onMessageListener, playNotificationSound } from '../services/notifications';
import useGeolocation from '../hooks/useGeolocation';
import { format, addDays } from 'date-fns';

function Missions() {
  const navigate = useNavigate();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [user, setUser] = useState(null);
  
  // Hook de géolocalisation
  const { isActive, precision, error: gpsError } = useGeolocation();
  // useRef pour éviter de recréer les listeners
  const listenersSetup = useRef(false);

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const loadMissions = useCallback(async (chauffeurId) => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const nextWeek = format(addDays(new Date(), 7), 'yyyy-MM-dd');

      const response = await getMissionsChauffeur(chauffeurId, {
        date_debut: today,
        date_fin: nextWeek,
      });
      
      setMissions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement missions:', error);
      showSnackbar('Erreur de chargement', 'error');
      setLoading(false);
    }
  }, [showSnackbar]);

  const handleMissionUpdate = useCallback((mission) => {
    setMissions((prev) => {
      const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (mission.chauffeur_id !== userFromStorage.id) {
        return prev;
      }

      const index = prev.findIndex((m) => m.id === mission.id);
      
      // ✅ C'EST UNE NOUVELLE MISSION → JOUER LE SON !
      if (index < 0 && mission.statut !== 'brouillon') {
        playNotificationSound(); // 🔊 SON 3X
        showSnackbar('🚨 Nouvelle mission reçue !', 'success');
        return [mission, ...prev];
      }
      
      // Mission existante → juste update
      if (index >= 0) {
        const newMissions = [...prev];
        newMissions[index] = mission;
        showSnackbar('Mission mise à jour', 'info');
        return newMissions;
      }
      
      return prev;
    });
  }, [showSnackbar]);

  const handleMissionsUpdate = useCallback(() => {
    const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
    if (userFromStorage.id) {
      loadMissions(userFromStorage.id);
    }
    showSnackbar('Nouvelles missions reçues', 'success');
  }, [loadMissions, showSnackbar]);

  const handleMissionDelete = useCallback((data) => {
    setMissions((prev) => prev.filter((m) => m.id !== data.id));
    showSnackbar('Mission supprimée', 'warning');
  }, [showSnackbar]);

  // Initialisation utilisateur (une seule fois)
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!userData || userData.role !== 'chauffeur') {
      navigate('/login');
      return;
    }

    setUser(userData);
    loadMissions(userData.id);
  }, [navigate, loadMissions]);

  // Setup des listeners (une seule fois)
  useEffect(() => {
    if (!user || listenersSetup.current) return;

    // Socket listeners
    socketService.on('mission:nouvelle', handleMissionUpdate); // ✅ CORRIGÉ : sans espace
    socketService.on('mission:envoyee', handleMissionUpdate);
    socketService.on('missions:envoyees', handleMissionsUpdate);
    socketService.on('mission:modifiee', handleMissionUpdate);
    socketService.on('mission:supprimee', handleMissionDelete);

    // Notification listener
    onMessageListener((payload) => {
      console.log('Notification reçue:', payload);
      
      const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
      if (userFromStorage.id) {
        loadMissions(userFromStorage.id);
      }

      const title = payload.notification?.title || 'Nouvelle notification';
      const body = payload.notification?.body || '';
      showSnackbar(`${title}: ${body}`, 'info');
    });

    listenersSetup.current = true;

    // Cleanup
    return () => {
      socketService.off('mission:nouvelle', handleMissionUpdate);
      socketService.off('mission:envoyee', handleMissionUpdate);
      socketService.off('missions:envoyees', handleMissionsUpdate);
      socketService.off('mission:modifiee', handleMissionUpdate);
      socketService.off('mission:supprimee', handleMissionDelete);
    };
  }, [user, handleMissionUpdate, handleMissionsUpdate, handleMissionDelete, loadMissions, showSnackbar]);

  const handleMissionUpdated = useCallback(() => {
    if (user) {
      loadMissions(user.id);
    }
  }, [user, loadMissions]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    socketService.disconnect();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header user={user} onLogout={handleLogout} gpsActive={isActive} precision={precision} />
      
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
          📋 Mes Missions
        </Typography>

        <ListeMissions
          missions={missions}
          onMissionUpdated={handleMissionUpdated}
        />
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Missions;
