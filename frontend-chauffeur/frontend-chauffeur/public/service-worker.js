/* eslint-disable no-restricted-globals */

// Service Worker pour PWA et notifications
const CACHE_NAME = 'transport-dange-chauffeur-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/logo192.png',
  '/logo512.png',
  '/manifest.json'
];

// Son encodé en Base64
const NOTIFICATION_SOUND_BASE64 = "data:audio/wav;base64,UklGRiQEAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAEAAD//wAA//8AAP//AAD//wAA//...";

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker : Installation...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache ouvert');
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('⚠️ Plusieurs fichiers n\'ont pas pu être mis en cache :', err);
          throw err;
        });
      })
      .then(() => {
        console.log('✅ Service Worker installé');
        return self.skipWaiting();
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker : Activation...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression de l\'ancien cache :', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activé');
      return self.clients.claim();
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Gestion des Push Notifications
self.addEventListener('push', (event) => {
  console.log('📩 Push notification reçue :', event);
  
  const notificationData = {
    title: '🚖 Transport DanGE',
    body: 'Nouvelle mission disponible',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [500, 200, 500, 200, 500],
    tag: 'mission-notification',
    requireInteraction: true,
    actions: [
      { action: 'view', title: '👀 Voir', icon: '/logo192.png' },
      { action: 'dismiss', title: '❌ Plus tard' }
    ]
  };

  // Afficher la notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );

  // Jouer le son 3 fois
  const audio = new Audio(NOTIFICATION_SOUND_BASE64);
  let playCount = 0;

  function playSoundRepeatedly() {
    if (playCount < 3) {
      audio.play();
      audio.onended = () => {
        playCount++;
        playSoundRepeatedly();
      };
    }
  }

  playSoundRepeatedly();
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification cliquée :', event.action);
  
  const audio = new Audio(NOTIFICATION_SOUND_BASE64);
  let playCount = 0;

  function playSoundRepeatedly() {
    if (playCount < 3) {
      audio.play();
      audio.onended = () => {
        playCount++;
        playSoundRepeatedly();
      };
    }
  }

  event.notification.close();
  playSoundRepeatedly();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
