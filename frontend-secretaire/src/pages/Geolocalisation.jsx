import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Room as RoomIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MapView from '../components/MapView';
import geolocationService from '../services/geolocationService';

function Geolocalisation() {
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'online', 'offline'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
  });

  // Initialisation
  useEffect(() => {
    initializeGeolocation();

    return () => {
      geolocationService.disconnect();
    };
  }, []);

  const initializeGeolocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialisation du service de géolocalisation
      geolocationService.initialize();

      // S'abonner aux mises à jour
      const unsubscribe = geolocationService.subscribe((newPositions) => {
        setPositions(newPositions);
        updateStats(newPositions);
        setLastUpdate(new Date());
      });

      // Charger les positions actives
      await geolocationService.loadActivePositions();

      setLoading(false);

      return () => unsubscribe();
    } catch (err) {
      console.error('Erreur initialisation géolocalisation:', err);
      setError('Impossible de charger les positions');
      setLoading(false);
    }
  };

  // Calculer les statistiques
  const updateStats = (positions) => {
    const now = new Date();
    const onlinePositions = positions.filter((p) => {
      const age = (now - new Date(p.timestamp)) / 1000;
      return age <= 300;
    });

    setStats({
      total: positions.length,
      online: onlinePositions.length,
      offline: positions.length - onlinePositions.length,
    });
  };

  // Filtrer les positions selon le filtre
  const getFilteredPositions = () => {
    const now = new Date();

    switch (filter) {
      case 'online':
        return positions.filter((p) => {
          const age = (now - new Date(p.timestamp)) / 1000;
          return age <= 300;
        });
      case 'offline':
        return positions.filter((p) => {
          const age = (now - new Date(p.timestamp)) / 1000;
          return age > 300;
        });
      default:
        return positions;
    }
  };

  // Gérer le clic sur un marqueur
  const handleMarkerClick = (position) => {
    console.log('Chauffeur sélectionné:', position);
  };

  // Rafraîchir les positions
  const handleRefresh = async () => {
    setLoading(true);
    await geolocationService.loadActivePositions();
    setLoading(false);
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredPositions = getFilteredPositions();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header onLogout={handleLogout} />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* En-tête */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <RoomIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold">
              Géolocalisation en Temps Réel
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Suivez la position de vos chauffeurs sur la carte en temps réel
          </Typography>
        </Box>

        {/* Erreurs */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Statistiques */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Chauffeurs
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {stats.total}
                    </Typography>
                  </Box>
                  <PersonIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      En Ligne
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="success.main">
                      {stats.online}
                    </Typography>
                  </Box>
                  <WifiIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Hors Ligne
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="error.main">
                      {stats.offline}
                    </Typography>
                  </Box>
                  <WifiOffIcon sx={{ fontSize: 48, color: 'error.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Carte */}
        <Paper elevation={3} sx={{ height: 600, overflow: 'hidden', borderRadius: 2 }}>
          {loading && positions.length === 0 ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <CircularProgress size={60} />
              <Typography variant="h6" color="text.secondary">
                Chargement des positions...
              </Typography>
            </Box>
          ) : filteredPositions.length === 0 ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <RoomIcon sx={{ fontSize: 80, color: 'text.disabled' }} />
              <Typography variant="h6" color="text.secondary">
                Aucune position disponible
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Les positions des chauffeurs apparaîtront ici une fois qu'ils activeront leur GPS
              </Typography>
            </Box>
          ) : (
            <MapView positions={filteredPositions} onMarkerClick={handleMarkerClick} />
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default Geolocalisation;
