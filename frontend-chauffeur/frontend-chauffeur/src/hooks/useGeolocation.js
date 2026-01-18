import { useState, useEffect, useRef } from 'react';
import { envoyerPosition } from '../services/api';

const useGeolocation = () => {
  const [position, setPosition] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [precision, setPrecision] = useState(null);
  const [error, setError] = useState(null);

  const watchIdRef = useRef(null);
  const intervalIdRef = useRef(null);
  const lastSentRef = useRef(null);

  useEffect(() => {
    // Vérifier que l'utilisateur est un chauffeur
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'chauffeur') {
      console.log('❌ Géolocalisation désactivée : utilisateur non-chauffeur');
      return;
    }

    // Vérifier le support de la géolocalisation
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée par ce navigateur');
      console.error('❌ Géolocalisation non supportée');
      return;
    }

    console.log('✅ Géolocalisation activée');

    // Options de géolocalisation
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    // Fonction d'envoi au backend
    const envoyerPositionAuBackend = async (lat, lon, acc) => {
      try {
        console.log('🛰️ Envoi position au serveur');
        await envoyerPosition(lat, lon, acc);
        console.log('✅ Position envoyée avec succès');
        lastSentRef.current = Date.now();
      } catch (err) {
        console.error('❌ Erreur envoi position:', err);
      }
    };

    // Callback succès
    const handleSuccess = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;

      console.log('📍 Position obtenue:', {
        latitude: latitude.toFixed(6),
        longitude: longitude.toFixed(6),
        precision: Math.round(accuracy) + 'm',
      });

      setPosition({ latitude, longitude });
      setPrecision(Math.round(accuracy));
      setIsActive(true);
      setError(null);

      // Envoyer immédiatement la première position
      if (!lastSentRef.current) {
        envoyerPositionAuBackend(latitude, longitude, Math.round(accuracy));
      }
    };

    // Callback erreur
    const handleError = (err) => {
      console.error('❌ Erreur géolocalisation:', err.message);
      setIsActive(false);

      switch (err.code) {
        case err.PERMISSION_DENIED:
          setError('Permission refusée');
          break;
        case err.POSITION_UNAVAILABLE:
          setError('Position indisponible');
          break;
        case err.TIMEOUT:
          setError('Délai expiré');
          break;
        default:
          setError('Erreur inconnue');
      }
    };

    // Démarrer le suivi de position
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    // Envoyer la position au serveur toutes les 300 secondes
    intervalIdRef.current = setInterval(() => {
      // Utiliser getCurrentPosition pour obtenir la position actuelle
      // sans dépendre de la variable d'état position
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          envoyerPositionAuBackend(latitude, longitude, Math.round(accuracy));
        },
        (err) => {
          console.error('❌ Erreur récupération position pour envoi:', err.message);
        },
        options
      );
    }, 300000); // 300 secondes

    // Nettoyage
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        console.log('🛑 Suivi GPS arrêté');
      }
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
        console.log('🛑 Envoi positions arrêté');
      }
    };
  }, []); // ✅ TABLEAU VIDE = S'EXÉCUTE UNE SEULE FOIS AU MONTAGE !

  return {
    position,
    isActive,
    precision,
    error,
  };
};

export default useGeolocation;
