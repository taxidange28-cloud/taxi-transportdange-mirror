import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DriverMarker from './DriverMarker';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const AutoBounds = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(
        positions.map(p => [p.latitude, p.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [positions, map]);

  return null;
};

const MapView = ({ positions, onMarkerClick, center, zoom }) => {
  const [mapCenter, setMapCenter] = useState(center || [48.4469, 1.4861]);
  const [mapZoom, setMapZoom] = useState(zoom || 10);

  useEffect(() => {
    if (positions.length > 0 && !center) {
      const avgLat = positions.reduce((sum, p) => sum + p.latitude, 0) / positions.length;
      const avgLng = positions.reduce((sum, p) => sum + p.longitude, 0) / positions.length;
      setMapCenter([avgLat, avgLng]);
    }
  }, [positions, center]);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {positions.map((position) => (
          <DriverMarker
            key={position.chauffeur_id}
            position={position}
            onClick={onMarkerClick}
          />
        ))}

        {positions.length > 0 && <AutoBounds positions={positions} />}
      </MapContainer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      {positions.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#6B7280' }}>
            Aucun chauffeur en ligne actuellement
          </p>
        </div>
      )}
    </div>
  );
};

export default MapView;
