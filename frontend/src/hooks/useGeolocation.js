import { useState, useEffect, useCallback, useRef } from 'react';

function useGeolocation(options = {}) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const watchIdRef = useRef(null);

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
    ...options,
  };

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    if (watchIdRef.current !== null) {
      return;
    }

    const handleSuccess = (pos) => {
      const { latitude, longitude, accuracy, speed, heading } = pos.coords;
      
      setPosition({
        latitude,
        longitude,
        accuracy,
        speed: speed || null,
        heading: heading || null,
        timestamp: new Date(pos.timestamp),
      });
      
      setError(null);
    };

    const handleError = (err) => {
      let errorMessage = 'Erreur de géolocalisation';
      
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = 'Permission de géolocalisation refusée';
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = 'Position GPS non disponible';
          break;
        case err.TIMEOUT:
          errorMessage = 'Délai de géolocalisation dépassé';
          break;
        default:
          errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Geolocation error:', err);
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      defaultOptions
    );

    setIsTracking(true);
  }, [defaultOptions]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsTracking(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    position,
    error,
    isTracking,
    startTracking,
    stopTracking,
  };
}

export default useGeolocation;
