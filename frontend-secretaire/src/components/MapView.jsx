import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Box, Alert } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DriverMarker from './DriverMarker';

// Fix pour les icônes Leaflet avec Webpack
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Composant pour ajuster automatiquement les limites de la carte
const AutoBounds = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0 && positions.every((p) => p.latitude && p.longitude)) {
      const bounds = L.latLngBounds(
        positions.map((p) => [p.latitude, p.longitude])
      );
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 14,
        animate: true,
      });
    }
  }, [positions, map]);

  return null;
};

const MapView = ({ positions, onMarkerClick, center, zoom }) => {
  // Centre par défaut (Dunois, Eure-et-Loir)
  const defaultCenter = center || [48.4469, 1.4861];
  const defaultZoom = zoom || 11;

  // Calculer le centre si des positions sont disponibles
  const mapCenter = positions.length > 0 && positions.every((p) => p.latitude && p.longitude) && !center
    ? [
        positions.reduce((sum, p) => sum + p.latitude, 0) / positions.length,
        positions.reduce((sum, p) => sum + p.longitude, 0) / positions.length
      ]
    : defaultCenter;

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
      <MapContainer
        center={mapCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
        zoomControl
      >
        {/* Couche de tuiles OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marqueurs des chauffeurs */}
        {positions.map((position) => (
          <DriverMarker
            key={position.chauffeur_id}
            position={position}
            onClick={onMarkerClick}
          />
        ))}

        {/* Ajustement automatique des limites */}
        {positions.length > 0 && <AutoBounds positions={positions} />}
      </MapContainer>

      {/* Message si aucun chauffeur */}
      {positions.length === 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            width: '80%',
            maxWidth: 400,
          }}
        >
          <Alert severity="info" sx={{ boxShadow: 3 }}>
            Aucun chauffeur en ligne actuellement. Les chauffeurs apparaîtront ici dès qu'ils activeront leur géolocalisation.
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default MapView;
