import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Enregistrer le service worker pour le mode PWA
// ✅ ACTIVER le service worker
serviceWorkerRegistration.register({
  onSuccess: () => console.log('✅ Service Worker enregistré avec succès'),
  onUpdate: (registration) => {
    console.log('🔄 Nouvelle version disponible');
    if (registration && registration.waiting) {
      registration. waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  },
});
