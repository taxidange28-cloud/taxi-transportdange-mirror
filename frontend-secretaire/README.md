# Transport DanGE - Frontend Secrétaire

Interface web pour la gestion des missions taxi - Application Transport DanGE.

## 🚀 Technologies

- **React 18** avec Hooks
- **Material-UI (MUI)** pour l'interface
- **Socket.io Client** pour les mises à jour en temps réel
- **Axios** pour les appels API
- **React Router** pour la navigation
- **date-fns** pour la gestion des dates

## 📋 Prérequis

- Node.js 16+ et npm
- Backend API en cours d'exécution

## 🔧 Installation

### 1. Installer les dépendances

```bash
cd frontend-secretaire
npm install
```

### 2. Configuration

Copier `.env.example` vers `.env` et configurer:

```bash
cp .env.example .env
```

Éditer `.env`:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

## 🎮 Démarrage

### Mode développement

```bash
npm start
```

L'application s'ouvre sur `http://localhost:3001`

### Build pour production

```bash
npm run build
```

Les fichiers sont générés dans le dossier `build/`

## 🎨 Design

### Couleurs Transport DanGE

- **Vert principal**: #4CAF50
- **Vert clair**: #8BC34A
- **Vert pastel**: #C8E6C9
- **Gris foncé**: #424242
- **Blanc**: #FFFFFF

### Statuts des missions

- ⚪ **Brouillon** - Non envoyée (gris)
- 🔵 **Envoyée** - Envoyée au chauffeur (bleu)
- 🟡 **Confirmée** - Lue par le chauffeur (jaune)
- 🔴 **En cours** - Prise en charge (rouge)
- 🟢 **Terminée** - Mission terminée (vert)

## 📱 Fonctionnalités

### Authentification

- Page de connexion avec branding Transport DanGE
- Vérification du rôle secrétaire
- Session sécurisée avec JWT

### Gestion des missions

- **Création de mission**:
  - Formulaire complet
  - Mode brouillon ou envoi immédiat
  - Assignation du chauffeur

- **Affichage Planning**:
  - Vue par date
  - Filtres : Aujourd'hui / Demain / Semaine
  - Indicateur missions en brouillon
  - Statuts colorés

- **Modification**:
  - Possible si pas en PEC ou terminée
  - Réassignation de chauffeur
  - Modification d'horaire

- **Suppression**:
  - Sans confirmation (rapide)
  - Disponible à tout moment

- **Envoi**:
  - Mission individuelle
  - Toutes les missions d'une date
  - Notification push automatique

### Temps réel

- **WebSocket** pour les mises à jour instantanées:
  - Changements de statut
  - Nouveaux commentaires chauffeurs
  - Missions ajoutées/modifiées/supprimées

### Export

- Export Excel des missions
- Période personnalisable
- Format prêt pour comptabilité

## 🔐 Connexion

**Compte secrétaire par défaut:**
- Username: `Secretaire`
- Password: `ChangezMoi123!`

## 📂 Structure des composants

```
src/
├── components/
│   ├── Header.jsx              # En-tête avec déconnexion
│   ├── Planning.jsx            # Vue principale des missions
│   ├── FormulaireMission.jsx   # Création de mission
│   └── PopupDetails.jsx        # Détails et modification
├── pages/
│   ├── Login.jsx               # Page de connexion
│   └── Dashboard.jsx           # Page principale
├── services/
│   ├── api.js                  # Appels API
│   └── socket.js               # WebSocket
├── styles/
│   └── theme.js                # Thème Material-UI
├── App.js                      # Routes et authentification
└── index.js                    # Point d'entrée
```

## 🔄 Flux de travail

1. **Connexion** → Authentification JWT
2. **Création mission** → Enregistrer en brouillon
3. **Envoi la veille** → Envoyer toutes les missions du lendemain
4. **Suivi en temps réel** → Voir les confirmations et PEC des chauffeurs
5. **Lecture commentaires** → Réponses instantanées des chauffeurs
6. **Export** → Comptabilité mensuelle

## 🛠️ Développement

### Ajouter un nouveau composant

```bash
# Dans src/components/
touch src/components/MonComposant.jsx
```

### Tester localement

```bash
npm start
```

### Build de production

```bash
npm run build
```

## 🐛 Debug

Ouvrir la console du navigateur (F12) pour voir:
- Logs des appels API
- Événements WebSocket
- Erreurs éventuelles

## 📦 Scripts NPM

- `npm start` - Démarrer en développement
- `npm run build` - Build pour production
- `npm test` - Lancer les tests
- `npm run eject` - Éjecter la configuration (⚠️ irréversible)

## 🤝 Support

Pour toute question, consultez la documentation complète dans `/documentation/`.
