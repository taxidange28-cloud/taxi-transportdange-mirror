# Transport DanGE - Frontend Chauffeur (PWA)

Progressive Web App pour les chauffeurs de taxi - Application Transport DanGE.

## 🚀 Technologies

- **React 18** avec Hooks
- **Material-UI (MUI)** pour l'interface mobile
- **PWA** (Progressive Web App) avec Service Worker
- **Firebase Cloud Messaging** pour les notifications push
- **Socket.io Client** pour les mises à jour en temps réel
- **Axios** pour les appels API
- **Workbox** pour la gestion du cache hors ligne

## 📋 Prérequis

- Node.js 16+ et npm
- Backend API en cours d'exécution
- Projet Firebase configuré (pour les notifications)
- Navigateur compatible PWA (Chrome, Edge, Safari)

## 🔧 Installation

### 1. Installer les dépendances

```bash
cd frontend-chauffeur
npm install
```

### 2. Configuration

Copier `.env.example` vers `.env` et configurer:

```bash
cp .env.example .env
```

Éditer `.env` avec vos paramètres Firebase:

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_FIREBASE_API_KEY=votre-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=votre-projet-id
REACT_APP_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=votre-sender-id
REACT_APP_FIREBASE_APP_ID=votre-app-id
REACT_APP_FIREBASE_VAPID_KEY=votre-vapid-key
```

### 3. Configurer Firebase Messaging

Éditer `public/firebase-messaging-sw.js` avec votre configuration Firebase.

## 🎮 Démarrage

### Mode développement

```bash
npm start
```

L'application s'ouvre sur `http://localhost:3002`

### Build pour production

```bash
npm run build
```

Les fichiers sont générés dans le dossier `build/`

## 📱 Installation PWA

### Sur Android (Chrome)

1. Ouvrir l'application dans Chrome
2. Menu → "Ajouter à l'écran d'accueil"
3. L'icône apparaît sur l'écran d'accueil
4. L'app s'ouvre en plein écran comme une app native

### Sur iOS (Safari)

1. Ouvrir l'application dans Safari
2. Bouton "Partager" → "Sur l'écran d'accueil"
3. Confirmer l'ajout
4. L'icône apparaît sur l'écran d'accueil

## 🎨 Design Mobile

### Couleurs Transport DanGE

- **Vert principal**: #4CAF50
- **Vert clair**: #8BC34A
- **Gris foncé**: #424242

### Optimisations tactiles

- Boutons larges et espacés
- Police minimum 16px
- Pas de zoom sur les inputs
- Gestes tactiles fluides

### Statuts des missions

- 🔵 **Envoyée** - Nouvelle mission (bleu)
- 🟡 **Confirmée** - Mission lue (jaune)
- 🔴 **En cours** - Prise en charge (rouge)
- 🟢 **Terminée** - Mission terminée (vert)

## 📱 Fonctionnalités

### Authentification

- Page de connexion chauffeur
- Session sécurisée avec JWT
- Déconnexion

### Gestion des missions

- **Affichage**:
  - Liste des missions envoyées uniquement
  - Regroupement par date
  - Badge "NOUVEAU" sur missions non lues
  - Vue détaillée collapsible

- **Actions**:
  - ✓ Confirmer réception (🔵 → 🟡)
  - 🚗 Prise en charge avec horodatage (🟡/🔵 → 🔴)
  - ✓ Mission terminée avec horodatage (🔴 → 🟢)
  - 💬 Ajouter un commentaire (à tout moment)

### Notifications Push

- **Firebase Cloud Messaging**:
  - Notification sonore
  - Vibration (500ms, 200ms, 500ms)
  - Badge sur l'icône
  - Haute priorité

- **Types de notifications**:
  - Nouvelle mission assignée
  - Mission modifiée
  - Mission supprimée

### Temps Réel

- **WebSocket** pour synchronisation instantanée:
  - Nouvelles missions
  - Modifications
  - Suppressions
  - Mise à jour automatique de l'interface

### Mode Hors Ligne

- **Service Worker** avec Workbox:
  - Cache des assets statiques
  - Fonctionne sans connexion
  - Synchronisation au retour en ligne

## 🔐 Connexion

**Comptes chauffeurs par défaut:**
- `patron / ChangezMoi123!`
- `franck / ChangezMoi123!`
- `laurence / ChangezMoi123!`
- `autre / ChangezMoi123!`

## 📂 Structure des composants

```
src/
├── components/
│   ├── Header.jsx          # En-tête avec déconnexion
│   ├── ListeMissions.jsx   # Liste groupée par date
│   └── CarteMission.jsx    # Carte mission avec actions
├── pages/
│   ├── Login.jsx           # Page de connexion
│   └── Missions.jsx        # Page principale
├── services/
│   ├── api.js              # Appels API
│   ├── notifications.js    # Firebase Cloud Messaging
│   └── socket.js           # WebSocket
├── App.js                  # Routes et thème
├── index.js                # Point d'entrée + SW
└── serviceWorkerRegistration.js
```

## 🔄 Workflow Chauffeur

1. **Connexion** → JWT + Token FCM enregistré
2. **Réception mission** → Notification push
3. **Confirmer réception** → Statut 🟡
4. **Arrivée client** → Prise en charge 🔴 (horodatage)
5. **Fin course** → Terminée 🟢 (horodatage)
6. **Commentaire** → Visible par secrétaire en temps réel

## 🔔 Configuration Notifications

### Obtenir les clés Firebase

1. Console Firebase → Project Settings
2. Cloud Messaging tab
3. Copier:
   - Server Key (backend)
   - Web Push certificates VAPID Key (frontend)
   - Configuration object (frontend)

### Tester les notifications

```javascript
// Dans la console du navigateur
Notification.requestPermission().then(permission => {
  console.log('Permission:', permission);
});
```

## 🛠️ Développement

### Mode développement

```bash
npm start
```

### Tester en mode PWA local

1. Build de production: `npm run build`
2. Servir avec un serveur HTTP:
   ```bash
   npx serve -s build -p 3002
   ```
3. Ouvrir dans Chrome
4. DevTools → Application → Service Workers

### Debug Service Worker

1. Chrome DevTools → Application
2. Section "Service Workers"
3. Voir les logs et le cache

## 📦 Scripts NPM

- `npm start` - Démarrer en développement
- `npm run build` - Build pour production
- `npm test` - Lancer les tests

## 🐛 Troubleshooting

### Notifications ne fonctionnent pas

1. Vérifier la configuration Firebase
2. Vérifier les permissions du navigateur
3. Tester sur HTTPS (requis pour FCM)
4. Voir console pour erreurs

### Service Worker ne s'installe pas

1. Vérifier la console DevTools
2. Désinstaller l'ancien SW
3. Vider le cache
4. Recharger l'application

### Mode hors ligne ne fonctionne pas

1. Vérifier que le SW est actif
2. Recharger la page 2 fois
3. Vérifier le cache dans DevTools

## 🌐 Déploiement

### Prérequis

- HTTPS obligatoire (Let's Encrypt)
- Service Worker nécessite HTTPS
- Firebase configuré et actif

### Build

```bash
npm run build
cd build
# Uploader vers serveur
```

## 🤝 Support

Pour toute question, consultez la documentation complète dans `/documentation/`.
