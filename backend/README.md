# Transport DanGE - Backend API

Backend API pour l'application de dispatch taxi Transport DanGE.

## 🚀 Technologies

- **Node.js** avec Express.js
- **PostgreSQL** pour la base de données
- **Socket.io** pour les mises à jour en temps réel
- **Firebase Cloud Messaging** pour les notifications push
- **JWT** pour l'authentification
- **ExcelJS** pour l'export Excel

## 📋 Prérequis

- Node.js 16+ et npm
- PostgreSQL 12+
- Compte Firebase (pour les notifications push)

## 🔧 Installation

### 1. Installer les dépendances

```bash
cd backend
npm install
```

### 2. Configuration de la base de données

Créer une base de données PostgreSQL:

```bash
createdb transport_dange
```

### 3. Configuration des variables d'environnement

Copier `.env.example` vers `.env` et configurer:

```bash
cp .env.example .env
```

Éditer `.env` avec vos paramètres:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=transport_dange
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_cle_secrete_jwt
FIREBASE_PROJECT_ID=votre-projet-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
```

### 4. Initialiser la base de données

```bash
npm run init-db
```

Cette commande:
- Crée toutes les tables
- Insère les utilisateurs par défaut
- Crée les véhicules d'exemple

## 🎮 Démarrage

### Mode développement (avec rechargement automatique)

```bash
npm run dev
```

### Mode production

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 📚 API Endpoints

### Authentification

- `POST /api/auth/login` - Connexion (retourne un JWT)
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Informations utilisateur connecté

### Missions (Secrétaire)

- `POST /api/missions` - Créer une mission
- `GET /api/missions` - Lister les missions (avec filtres)
- `GET /api/missions/:id` - Détails d'une mission
- `PUT /api/missions/:id` - Modifier une mission
- `DELETE /api/missions/:id` - Supprimer une mission
- `POST /api/missions/:id/envoyer` - Envoyer une mission
- `POST /api/missions/envoyer-date` - Envoyer toutes les missions d'une date

### Missions (Chauffeur)

- `GET /api/chauffeurs/:id/missions` - Missions du chauffeur (envoyées uniquement)
- `POST /api/missions/:id/confirmer` - Confirmer réception
- `POST /api/missions/:id/pec` - Prise en charge
- `POST /api/missions/:id/terminer` - Terminer la mission
- `POST /api/missions/:id/commentaire` - Ajouter un commentaire

### Chauffeurs

- `GET /api/chauffeurs` - Lister tous les chauffeurs
- `POST /api/chauffeurs/:id/fcm-token` - Enregistrer le token FCM

### Export

- `GET /api/export/excel?debut=DATE&fin=DATE` - Exporter en Excel

## 🔐 Comptes par défaut

**Secrétaire:**
- Username: `Secretaire`
- Password: `ChangezMoi123!`

**Chauffeurs:**
- `patron / ChangezMoi123!`
- `franck / ChangezMoi123!`
- `laurence / ChangezMoi123!`
- `autre / ChangezMoi123!`

## 🌐 WebSocket

Le serveur émet les événements suivants:

- `mission:nouvelle` - Nouvelle mission créée
- `mission:envoyee` - Mission envoyée
- `missions:envoyees` - Plusieurs missions envoyées
- `mission:modifiee` - Mission modifiée
- `mission:supprimee` - Mission supprimée
- `mission:confirmee` - Mission confirmée par chauffeur
- `mission:pec` - Prise en charge
- `mission:terminee` - Mission terminée
- `mission:commentaire` - Nouveau commentaire

## 📊 Structure de la base de données

### Table `utilisateurs` (secrétaire)
- id, username, password, role, created_at, updated_at

### Table `chauffeurs`
- id, username, password, nom, fcm_token, actif, created_at, updated_at

### Table `missions`
- id, date_mission, heure_prevue, client, type, adresse_depart, adresse_arrivee
- chauffeur_id, vehicule_id, notes, statut
- heure_pec, heure_depose, duree_minutes
- commentaire_chauffeur, envoyee_le, confirmee_le
- created_at, updated_at

### Table `vehicules`
- id, immatriculation, modele, chauffeur_id, created_at

## 🔔 Notifications Push

Les notifications sont envoyées via Firebase Cloud Messaging pour:
- Nouvelle mission assignée
- Mission modifiée
- Mission supprimée

## 🛡️ Sécurité

- **Helmet** - Protection des headers HTTP
- **CORS** - Contrôle d'accès cross-origin
- **Rate Limiting** - Protection contre le spam
- **JWT** - Authentification sécurisée
- **Bcrypt** - Hash des mots de passe

## 📝 Statuts des missions

- `brouillon` ⚪ - Non envoyée (invisible pour le chauffeur)
- `envoyee` 🔵 - Envoyée au chauffeur
- `confirmee` 🟡 - Confirmée par le chauffeur
- `pec` 🔴 - Prise en charge (en cours)
- `terminee` 🟢 - Terminée

## 🐛 Debug

Pour afficher les logs détaillés:

```bash
NODE_ENV=development npm run dev
```

## 📦 Scripts NPM

- `npm start` - Démarrer le serveur
- `npm run dev` - Démarrer en mode développement
- `npm run init-db` - Initialiser la base de données

## 🤝 Support

Pour toute question concernant le backend, consultez la documentation complète dans `/documentation/`.
