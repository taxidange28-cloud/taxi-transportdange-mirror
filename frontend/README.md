# 🚕 Frontend Transport DanGE

Application web React complète et moderne pour gérer les missions de taxi avec deux interfaces distinctes : Secrétaire et Chauffeur.

## 🎯 Fonctionnalités

### 🔐 Authentification
- Page de connexion avec gestion JWT
- Redirection selon le rôle (secrétaire ou chauffeur)

### 👔 Interface Secrétaire
- **Dashboard** : Vue d'ensemble avec statistiques KPIs
- **Créer Mission** : Formulaire complet de création de mission
- **Liste Missions** : Affichage avec filtres par statut et dates
- **Statistiques** : Métriques détaillées des missions

### 🚕 Interface Chauffeur
- **Dashboard** : Vue d'ensemble des missions
- **Mes Missions** : Liste des missions assignées avec actions
- **Détail Mission** : Informations complètes et commentaires
- **Actions** : Confirmer, Prendre en charge, Terminer

## 🛠️ Technologies

- **React** 18.2
- **Vite** - Build tool moderne et rapide
- **TailwindCSS** - Framework CSS utilitaire
- **React Router** v6 - Routing
- **Axios** - Client HTTP
- **Lucide React** - Icônes
- **date-fns** - Manipulation de dates

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview
```

## ⚙️ Configuration

Créer un fichier `.env` à la racine :

```env
VITE_API_URL=https://taxi-transportdange.onrender.com/api
```
attention mettre railway si l'app est dans railway

Pour le développement local :
```env
VITE_API_URL=http://localhost:3000/api
```

## 📁 Structure du projet

```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── Login.jsx
│   │   ├── Secretaire/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreerMission.jsx
│   │   │   ├── ListeMissions.jsx
│   │   │   └── Statistiques.jsx
│   │   ├── Chauffeur/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MesMissions.jsx
│   │   │   └── DetailMission.jsx
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   └── Common/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       └── Card.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── formatters.js
│   ├── App.jsx
│   └── main.jsx
├── public/
├── .env
├── .env.example
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Design

- **Couleurs principales** :
  - Vert principal : `#4CAF50`
  - Vert clair : `#8BC34A`
  - Vert foncé : `#388E3C`
- **Design responsive** : Mobile-first
- **Composants réutilisables** : Button, Input, Card
- **Navigation intuitive** : Header + Sidebar selon le rôle

## 🔐 Comptes de test

**Secrétaire :**
- Username: `Secretaire`
- Password: `ChangezMoi123!`

**Chauffeur :**
- Username: `patron` / `franck` / `laurence`
- Password: `ChangezMoi123!`

## 📱 Routes disponibles

### Publiques
- `/login` - Page de connexion

### Secrétaire (protégées)
- `/secretaire/dashboard` - Dashboard principal
- `/secretaire/missions/creer` - Créer une mission
- `/secretaire/missions` - Liste des missions
- `/secretaire/statistiques` - Statistiques

### Chauffeur (protégées)
- `/chauffeur/dashboard` - Dashboard chauffeur
- `/chauffeur/missions` - Mes missions
- `/chauffeur/missions/:id` - Détail d'une mission
- `/chauffeur/historique` - Historique

## 🌐 Déploiement

L'application est configurée pour être déployée sur Render ou tout autre service de hosting statique.

Build automatique avec :
```bash
npm run build
```

Le dossier `dist/` contient les fichiers optimisés pour la production.

## 📝 Notes

- Intercepteurs Axios pour la gestion automatique du token JWT
- Gestion des erreurs 401 avec déconnexion automatique
- Context API pour l'authentification globale
- Routes protégées avec vérification du rôle
- Design professionnel et moderne

---

**Version:** 1.0.0 | **Transport DanGE** - Dunois, Eure-et-Loir

