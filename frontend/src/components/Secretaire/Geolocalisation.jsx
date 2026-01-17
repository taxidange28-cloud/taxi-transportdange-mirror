import React, { useState, useEffect } from 'react';
import { Navigation, Users, Wifi, WifiOff } from 'lucide-react';
import Card from '../Common/Card';
import MapView from '../Map/MapView';
import geolocationService from '../../services/geolocationService';

const Geolocalisation = () => {
  const [positions, setPositions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
  });

  useEffect(() => {
    geolocationService.initialize();

    const unsubscribe = geolocationService.subscribe((newPositions) => {
      setPositions(newPositions);
      updateStats(newPositions);
    });

    geolocationService.loadActivePositions();

    return () => {
      unsubscribe();
    };
  }, []);

  const updateStats = (positions) => {
    const now = new Date();
    const online = positions.filter(p => {
      const age = (now - new Date(p.timestamp)) / 1000;
      return age <= 300;
    });
    
    setStats({
      total: positions.length,
      online: online.length,
      offline: positions.length - online.length,
    });
  };

  const getFilteredPositions = () => {
    const now = new Date();
    
    switch (filter) {
      case 'online':
        return positions.filter(p => {
          const age = (now - new Date(p.timestamp)) / 1000;
          return age <= 300;
        });
      case 'offline':
        return positions.filter(p => {
          const age = (now - new Date(p.timestamp)) / 1000;
          return age > 300;
        });
      default:
        return positions;
    }
  };

  const handleMarkerClick = (position) => {
    console.log('Chauffeur clicked:', position);
  };

  const filteredPositions = getFilteredPositions();

  const filterButtons = [
    { id: 'all', label: 'Tous', count: stats.total, icon: Users },
    { id: 'online', label: 'En ligne', count: stats.online, icon: Wifi },
    { id: 'offline', label: 'Hors ligne', count: stats.offline, icon: WifiOff },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Navigation className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Géolocalisation des Chauffeurs</h2>
        </div>
        <p className="text-gray-600">
          Suivez en temps réel la position de vos chauffeurs sur la carte
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {filterButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = filter === btn.id;
          
          return (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`
                p-4 rounded-lg border-2 transition-all
                ${isActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-lg
                    ${isActive ? 'bg-blue-100' : 'bg-gray-100'}
                  `}>
                    <Icon className={`
                      w-5 h-5
                      ${isActive ? 'text-blue-600' : 'text-gray-600'}
                    `} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-600 font-medium">{btn.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{btn.count}</p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Card className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="h-full min-h-[500px]">
          <MapView
            positions={filteredPositions}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      </Card>

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>En ligne (&lt;5min)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>Signal faible (2-5min)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <span>Hors ligne (&gt;5min)</span>
        </div>
      </div>
    </div>
  );
};

export default Geolocalisation;
