# 02 - Configuration Firebase

Guide pour configurer Firebase Cloud Messaging pour les notifications push.

## 🎯 Objectif

Activer les notifications push pour les chauffeurs via Firebase Cloud Messaging (FCM).

## 🆓 Service Gratuit

Firebase Cloud Messaging est **GRATUIT** et inclus dans tous les plans Firebase.

## 📝 Étapes de Configuration

### 1. Créer un Projet Firebase

1. Aller sur https://console.firebase.google.com/
2. Cliquer sur "Ajouter un projet"
3. Nom du projet: `transport-dange`
4. Accepter les conditions
5. Désactiver Google Analytics (optionnel)
6. Cliquer sur "Créer le projet"

### 2. Ajouter une Application Web

1. Dans la console Firebase, cliquer sur "Web" (icône </>)
2. Nom de l'app: `Transport DanGE Chauffeur`
3. Cocher "Configurer Firebase Hosting" (optionnel)
4. Cliquer sur "Enregistrer l'app"
5. **Copier la configuration** affichée

### 3. Activer Cloud Messaging

1. Dans le menu latéral: "Toutes les fonctionnalités"
2. Cliquer sur "Cloud Messaging"
3. L'API est automatiquement activée

### 4. Générer une clé VAPID

1. Dans Cloud Messaging
2. Onglet "Web configuration"
3. Section "Web Push certificates"
4. Cliquer sur "Générer une paire de clés"
5. **Copier la clé VAPID** générée

### 5. Créer un Compte de Service (Backend)

1. Dans Paramètres du projet (⚙️)
2. Onglet "Comptes de service"
3. Cliquer sur "Générer une nouvelle clé privée"
4. Télécharger le fichier JSON
5. **Conserver ce fichier en sécurité**

## 🔑 Clés à Récupérer

### Pour le Frontend Chauffeur (.env)

```env
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=transport-dange.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=transport-dange
REACT_APP_FIREBASE_STORAGE_BUCKET=transport-dange.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
REACT_APP_FIREBASE_VAPID_KEY=BNx...
```

### Pour le Backend (.env)

Ouvrir le fichier JSON téléchargé et copier:

```env
FIREBASE_PROJECT_ID=transport-dange
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@transport-dange.iam.gserviceaccount.com
```

## 📱 Configuration du Service Worker

### Éditer frontend-chauffeur/public/firebase-messaging-sw.js

```javascript
firebase.initializeApp({
  apiKey: "AIzaSy...",
  authDomain: "transport-dange.firebaseapp.com",
  projectId: "transport-dange",
  storageBucket: "transport-dange.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
});
```

## ✅ Test des Notifications

### Dans la Console Firebase

1. Cloud Messaging → "Envoyer votre premier message"
2. Titre: Test
3. Message: Test notification
4. Sélectionner l'application web
5. Envoyer

### Test depuis l'Application

1. Se connecter en tant que chauffeur
2. Autoriser les notifications dans le navigateur
3. Créer une mission et l'envoyer au chauffeur
4. Vérifier que la notification apparaît

## 🔒 Sécurité

**⚠️ IMPORTANT:**
- Ne jamais commiter les clés privées dans Git
- Utiliser les variables d'environnement
- Restreindre les domaines autorisés dans Firebase Console

## 🚨 Dépannage

### Notifications ne fonctionnent pas

1. Vérifier que HTTPS est activé
2. Vérifier les permissions du navigateur
3. Vérifier la configuration Firebase
4. Consulter la console du navigateur

### Erreur "Firebase not initialized"

Vérifier que toutes les clés sont correctement copiées dans les .env

## 📊 Limites Gratuites

Firebase Cloud Messaging (gratuit illimité):
- ✅ Notifications illimitées
- ✅ Pas de limite d'utilisateurs
- ✅ Analytics inclus

## ➡️ Prochaine Étape

Passez au déploiement du backend:
📄 **03-DEPLOIEMENT-BACKEND.md**
