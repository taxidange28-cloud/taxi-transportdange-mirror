import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { enregistrerFcmToken } from './api';

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

let app;
let messaging;

// Initialiser Firebase
export const initializeFirebase = () => {
  try {
    if (!app) {
      app = initializeApp(firebaseConfig);
      messaging = getMessaging(app);
      console.log('✅ Firebase initialisé');
    }
    return { app, messaging };
  } catch (error) {
    console.error('❌ Erreur initialisation Firebase:', error);
    return { app: null, messaging: null };
  }
};

// Demander la permission de notification
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('✅ Permission de notification accordée');
      return true;
    } else {
      console.log('❌ Permission de notification refusée');
      return false;
    }
  } catch (error) {
    console.error('Erreur demande permission:', error);
    return false;
  }
};

// Obtenir le token FCM et l'enregistrer en BDD
export const getFCMToken = async (chauffeurId) => {
  try {
    const { messaging } = initializeFirebase();
    if (!messaging) {
      console.warn('Firebase Messaging non disponible');
      return null;
    }

    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      return null;
    }

    // ✅ Obtenir le token avec timeout de sécurité (10 secondes max)
    console.log('⏳ Obtention du token FCM...');
    
    const currentToken = await Promise.race([
      getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: Impossible d\'obtenir le token FCM après 10 secondes')), 10000)
      )
    ]);

    if (currentToken) {
      console.log('✅ Token FCM obtenu:', currentToken.substring(0, 30) + '...');
      
      // Enregistrer le token en base de données
      await enregistrerFcmToken(chauffeurId, currentToken);
      console.log('✅ Token FCM enregistré en BDD');
      
      return currentToken;
    } else {
      console.log('❌ Aucun token FCM disponible');
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur obtention token FCM:', error);
    return null;
  }
};

// Jouer le son de notification (3 fois)
export const playNotificationSound = () => {
  try {
    console.log('🔊 Lecture du son...');
    
    const audio = new Audio('/notification-sound.mp3');
    audio.volume = 1.0;
    
    let playCount = 0;
    const maxPlays = 3;
    
    const playNext = () => {
      if (playCount < maxPlays) {
        audio.currentTime = 0;
        audio.play()
          .then(() => {
            console.log(`✅ Son joué ${playCount + 1}/${maxPlays}`);
            playCount++;
          })
          .catch(err => console.error('❌ Erreur son:', err));
      }
    };
    
    audio.addEventListener('ended', playNext);
    audio.addEventListener('error', (e) => console.error('❌ Erreur audio:', e));
    
    playNext();
  } catch (error) {
    console.error('❌ Erreur son:', error);
  }
};

// Écouter les messages en temps réel (quand l'app est ouverte)
export const onMessageListener = (callback) => {
  const { messaging } = initializeFirebase();
  if (!messaging) {
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    console.log('📩 Message reçu:', payload);
    
    // Jouer le son
    playNotificationSound();
    
    // Afficher la notification
    if (payload.notification) {
      const notificationTitle = payload.notification.title || '🚖 Transport DanGE';
      const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo192.png',
        badge: '/logo192.png',
        vibrate: [1000, 500, 1000, 500, 1000],
        requireInteraction: true,
        tag: 'mission-' + Date.now(),
        data: payload.data,
      };
      
      if (Notification.permission === 'granted') {
        new Notification(notificationTitle, notificationOptions);
      }
    }
    
    callback(payload);
  });
};

export default {
  initializeFirebase,
  requestNotificationPermission,
  getFCMToken,
  onMessageListener,
  playNotificationSound,
};
