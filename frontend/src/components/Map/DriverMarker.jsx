import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

const DriverMarker = ({ position, onClick }) => {
  // Validation et conversion des coordonnées
  const lat = parseFloat(position.latitude);
  const lng = parseFloat(position.longitude);

  // Si coordonnées invalides, ne pas afficher le marqueur
  if (!isFinite(lat) || !isFinite(lng)) {
    console.warn('Coordonnées invalides pour le chauffeur:', position.chauffeur_nom);
    return null;
  }

  const getMarkerColor = () => {
    const now = new Date();
    const positionAge = (now - new Date(position.timestamp)) / 1000;
    
    if (positionAge > 300) return '#6B7280';
    if (positionAge > 120) return '#F59E0B';
    return '#10B981';
  };

  const getStatusText = () => {
    const now = new Date();
    const positionAge = (now - new Date(position.timestamp)) / 1000;
    
    if (positionAge > 300) return 'Hors ligne';
    if (positionAge > 120) return 'Signal faible';
    return 'En ligne';
  };

  const markerIcon = L.divIcon({
    html: `
      <div style="position: relative;">
        <div style="
          width: 32px;
          height: 32px;
          background: ${getMarkerColor()};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          font-size: 16px;
        ">
          🚗
        </div>
        <div style="
          position: absolute;
          top: -8px;
          right: -8px;
          width: 12px;
          height: 12px;
          background: ${getMarkerColor()};
          border: 2px solid white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffSeconds = Math.floor((now - date) / 1000);

    if (diffSeconds < 60) return `Il y a ${diffSeconds}s`;
    if (diffSeconds < 3600) return `Il y a ${Math.floor(diffSeconds / 60)}min`;
    return format(date, 'HH:mm', { locale: fr });
  };

  const safeFixed = (val, n = 6) => {
    const num = Number(val);
    return isFinite(num) ? num.toFixed(n) : '--';
  };

  return (
    <Marker
      position={[lat, lng]}
      icon={markerIcon}
      eventHandlers={{
        click: () => onClick && onClick(position),
      }}
    >
      <Popup>
        <div style={{ minWidth: '200px' }}>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '16px', 
            marginBottom: '8px',
            color: '#1F2937'
          }}>
            🚗 {position.chauffeur_nom || position.chauffeur_username}
          </div>
          
          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
            <strong>Statut :</strong>{' '}
            <span style={{ color: getMarkerColor(), fontWeight: 'bold' }}>
              {getStatusText()}
            </span>
          </div>
          
          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
            <strong>Position :</strong> {formatTimestamp(position.timestamp)}
          </div>
          
          {position.accuracy && (
            <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
              <strong>Précision :</strong> ±{Math.round(Number(position.accuracy))}m
            </div>
          )}
          
          <div style={{ 
            fontSize: '11px', 
            color: '#9CA3AF', 
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid #E5E7EB'
          }}>
            {safeFixed(lat, 6)}, {safeFixed(lng, 6)}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default DriverMarker;
