import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Logout, Map, Dashboard as DashboardIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

function Header({ onLogout }) {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  })();

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mr: 2 }}>
            🚕 Transport DanGE
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Planning des missions
          </Typography>
        </Box>

        {/* MENU NAVIGATION */}
        <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/')}
            sx={{
              borderRadius: 2,
              bgcolor: location.pathname === '/' ? 'rgba(255,255,255,0.2)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Planning
          </Button>
          <Button
            color="inherit"
            startIcon={<Map />}
            onClick={() => navigate('/geolocalisation')}
            sx={{
              borderRadius: 2,
              bgcolor: location.pathname === '/geolocalisation' ? 'rgba(255,255,255,0.2)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Géolocalisation
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1">
            👤 {user?.username || 'Secrétaire'}
          </Typography>
          <Button
            color="inherit"
            onClick={onLogout}
            startIcon={<Logout />}
            sx={{ 
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Déconnexion
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
