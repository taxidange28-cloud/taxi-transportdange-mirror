import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Box, Typography, Chip } from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DriverMarker = ({ position, onClick }) => {
  // Déterminer la couleur selon l'ancienneté de la position
  const getMarkerColor = () => {
    const now = new Date();
    const positionAge = (now - new Date(position.timestamp)) / 1000; // en secondes

    if (positionAge > 300) return '#9E9E9E'; // Gris - hors ligne (>5min)
    if (positionAge > 120) return '#FF9800'; // Orange - signal faible (>2min)
    return '#4CAF50'; // Vert - en ligne
  };

  const getStatusText = () => {
    const now = new Date();
    const positionAge = (now - new Date(position.timestamp)) / 1000;

    if (positionAge > 300) return 'Hors ligne';
    if (positionAge > 120) return 'Signal faible';
    return 'En ligne';
  };

  const getStatusColor = () => {
    const now = new Date();
    const positionAge = (now - new Date(position.timestamp)) / 1000;

    if (positionAge > 300) return 'default';
    if (positionAge > 120) return 'warning';
    return 'success';
  };

  // Icône personnalisée avec animation
  const markerIcon = L.divIcon({
    html: `
      <div style="position: relative;">
        <div style="
          width: 36px;
          height: 36px;
          background: ${getMarkerColor()};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          font-size: 18px;
        ">
          🚗
        </div>
        <div style="
          position: absolute;
          top: -10px;
          right: -10px;
          width: 14px;
          height: 14px;
          background: ${getMarkerColor()};
          border: 2px solid white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
      </div>
    `,
    className: 'custom-driver-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });

  // Formater l'horodatage
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);

    if (diffSeconds < 60) return `Il y a ${diffSeconds}s`;
    if (diffSeconds < 3600) return `Il y a ${Math.floor(diffSeconds / 60)}min`;
    return format(date, 'HH:mm', { locale: fr });
  };

  return (
    <>
      <Marker
        position={[
          position.latitude || 0,
          position.longitude || 0, // Sécurisation en cas de valeur indéfinie
        ]}
        icon={markerIcon}
        eventHandlers={{
          click: () => onClick && onClick(position),
        }}
      >
        <Popup maxWidth={300}>
          <Box sx={{ p: 1, minWidth: 250 }}>
            {/* Nom du chauffeur */}
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
              🚗 {position.chauffeur_nom || position.chauffeur_username || 'Chauffeur'}
            </Typography>

            {/* Statut */}
            <Box sx={{ mb: 1 }}>
              <Chip
                label={getStatusText()}
                color={getStatusColor()}
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>

            {/* Coordonnées */}
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>📍 Position :</strong> {position.latitude?.toFixed(6) || 'N/A'}°,{' '}
              {position.longitude?.toFixed(6) || 'N/A'}°
            </Typography>

            {/* Précision */}
            {position.accuracy && (
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>🎯 Précision :</strong> ±{Math.round(position.accuracy)}m
              </Typography>
            )}

            {/* Vitesse */}
            {position.speed && position.speed > 0 && (
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>⚡ Vitesse :</strong> {Math.round(position.speed * 3.6)} km/h
              </Typography>
            )}

            {/* Horodatage */}
            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 1, color: 'text.secondary' }}
            >
              ⏰ Dernière mise à jour : {position.timestamp ? formatTimestamp(position.timestamp) : 'N/A'}
            </Typography>
          </Box>
        </Popup>
      </Marker>

      {/* Style pour l'animation pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.5; 
            transform: scale(1.3); 
          }
        }
        .custom-driver-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </>
  );
};

export default DriverMarker;
