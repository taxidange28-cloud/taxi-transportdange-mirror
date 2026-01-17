# 🔐 Guide d'Administration - Transport DanGE

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Accès au panneau admin](#accès-au-panneau-admin)
3. [Fonctionnalités](#fonctionnalités)
4. [Gestion des utilisateurs](#gestion-des-utilisateurs)
5. [Statistiques](#statistiques)
6. [Sécurité](#sécurité)
7. [API Admin](#api-admin)
8. [Dépannage](#dépannage)

---

## 🎯 Vue d'ensemble

Le panneau d'administration permet aux administrateurs de gérer l'ensemble de la plateforme Transport DanGE, incluant : 

- ✅ Gestion complète des utilisateurs (secrétaires et chauffeurs)
- ✅ Visualisation des statistiques globales
- ✅ Création, modification et suppression des comptes
- ✅ Changement des mots de passe
- ✅ Vue d'ensemble de l'activité de la plateforme

---

## 🔑 Accès au panneau admin

### URL de connexion

**En production :**

### Identifiants par défaut

**⚠️ IMPORTANT :  Changez ces identifiants après la première connexion ! **

### Processus de connexion

1. Accédez à `/admin/login`
2. Entrez vos identifiants administrateur
3. Cliquez sur "Sign In"
4. Vous serez redirigé vers `/admin/dashboard`

---

## 🎨 Fonctionnalités

### Dashboard Principal (`/admin/dashboard`)

Le dashboard affiche :
- 📊 Statistiques en temps réel
- 👥 Nombre total d'utilisateurs
- 🚗 Nombre de missions actives
- 💰 Chiffre d'affaires total
- ⚠️ Problèmes en attente
- 📈 Activité récente

### Gestion des Utilisateurs (`/admin/users`)

Interface complète pour :
- 👀 Voir tous les utilisateurs (admins, secrétaires, chauffeurs)
- ➕ Créer de nouveaux comptes
- ✏️ Modifier les informations utilisateur
- 🔑 Changer les mots de passe
- 🗑️ Supprimer des comptes

### Statistiques (`/admin/stats`)

Tableau de bord statistique avec :
- 📊 Total des utilisateurs par rôle
- 📈 Statistiques des missions
- 💰 Chiffre d'affaires
- 🎯 Indicateurs de performance
- 📅 Filtres par période

---

## 👥 Gestion des utilisateurs

### Créer un nouvel utilisateur

#### Étapes : 

1. Cliquez sur **"Nouvel Utilisateur"**
2. Remplissez le formulaire : 
   - **Nom d'utilisateur** (min.  3 caractères, requis)
   - **Mot de passe** (min. 6 caractères, requis)
   - **Nom** (requis pour les chauffeurs)
   - **Rôle** :  Secrétaire ou Chauffeur
3. Cliquez sur **"Créer"**

#### Règles de validation :

- ✅ Username :  minimum 3 caractères, unique
- ✅ Password : minimum 6 caractères
- ✅ Nom :  requis pour les chauffeurs
- ✅ Rôle : secrétaire ou chauffeur uniquement

---

### Modifier un utilisateur

#### Étapes : 

1. Trouvez l'utilisateur dans la liste
2. Cliquez sur l'icône **✏️ (Modifier)**
3. Modifiez les informations : 
   - Nom d'utilisateur
   - Nom (pour les chauffeurs)
4. Cliquez sur **"Enregistrer"**

**Note :** Le rôle ne peut pas être modifié.  Pour changer de rôle, supprimez et recréez le compte.

---

### Changer un mot de passe

#### Étapes :

1. Trouvez l'utilisateur dans la liste
2. Cliquez sur l'icône **🔑 (Mot de passe)**
3. Entrez le nouveau mot de passe
4. Confirmez le mot de passe
5. Cliquez sur **"Modifier"**

#### Règles de mot de passe :

- ✅ Minimum 6 caractères
- ✅ Les deux mots de passe doivent correspondre
- ✅ Pas de restriction de caractères spéciaux

---

### Supprimer un utilisateur

#### Étapes :

1. Trouvez l'utilisateur dans la liste
2. Cliquez sur l'icône **🗑️ (Supprimer)**
3. **Confirmez la suppression** dans la fenêtre modale
4. L'utilisateur sera définitivement supprimé

#### ⚠️ ATTENTION :

- ❌ Vous ne pouvez pas supprimer le dernier administrateur
- ❌ Cette action est **irréversible**
- ❌ Toutes les données liées seront supprimées
- ✅ Vérifiez bien avant de confirmer

---

## 📊 Statistiques

### Données disponibles

#### Utilisateurs
- **Total** :  Tous les utilisateurs (admins + secrétaires + chauffeurs)
- **Secrétaires** : Nombre total de secrétaires
- **Chauffeurs** : Nombre total de chauffeurs
- **Admins** : Nombre d'administrateurs

#### Missions
- **Total des missions** : Toutes les missions créées
- **Missions terminées** : Missions avec statut "terminée"
- **Missions en cours** : Missions actives
- **Missions annulées** : Missions annulées

#### Finances
- **Chiffre d'affaires total** : Somme des missions terminées
- **Valeur moyenne** : Prix moyen d'une mission
- **Croissance mensuelle** : Évolution du CA

### Actualiser les données

Cliquez sur le bouton **"Actualiser" 🔄** pour recharger les statistiques en temps réel.

---

## 🔒 Sécurité

### Authentification

Le panneau admin utilise : 
- ✅ **JWT (JSON Web Tokens)** pour l'authentification
- ✅ **Middleware d'authentification** (`adminAuth.js`)
- ✅ **Vérification du rôle admin** via le token
- ✅ **Protection contre les accès non autorisés**
- ✅ **Code de retour 403** si droits insuffisants

### Architecture de sécurité

### Middleware de protection

Le fichier `backend/src/middleware/adminAuth. js` protège toutes les routes admin :

```javascript
const adminAuth = (req, res, next) => {
  try {
    const token = req. header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res. status(401).json({ 
        error: 'Authentification requise' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Accès refusé.  Droits administrateur requis.' 
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};
http://localhost:5000/api/admin
Authorization: Bearer <votre_token_jwt>
Content-Type: application/json
GET /api/admin/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "role": "admin",
      "created_at": "2026-01-01T12:00:00Z",
      "table":  "utilisateurs"
    },
    {
      "id": 2,
      "username": "patron",
      "nom": "Patron",
      "role": "chauffeur",
      "created_at": "2026-01-01T12:00:00Z",
      "table": "chauffeurs"
    }
  ]
}
POST /api/admin/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "username": "nouveau_chauffeur",
  "password": "MotDePasse123! ",
  "nom": "Jean Dupont",
  "role": "chauffeur"
}
{
  "id": 5,
  "username": "nouveau_chauffeur",
  "nom": "Jean Dupont",
  "role": "chauffeur",
  "created_at": "2026-01-01T18:30:00Z",
  "table": "chauffeurs"
}
PUT /api/admin/users/5
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "username": "nouveau_nom",
  "nom": "Nouveau Nom",
  "table": "chauffeurs"
}
{
  "id": 5,
  "username": "nouveau_nom",
  "nom": "Nouveau Nom",
  "role": "chauffeur",
  "table": "chauffeurs"
}
PUT /api/admin/users/5/password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "newPassword": "NouveauMotDePasse123!",
  "table": "chauffeurs"
}
{
  "message": "Mot de passe modifié avec succès"
}
DELETE /api/admin/users/5? table=chauffeurs
Authorization:  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
{
  "message": "Utilisateur supprimé avec succès"
}
GET /api/admin/stats
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
{
  "totalUsers": 15,
  "secretaires": 1,
  "chauffeurs":  4,
  "admins": 1,
  "missions": 234,
  "chiffreAffaires": 45230. 50
}
# Vérifier le backend
curl http://localhost:5000/api/health
SELECT id, username, role FROM utilisateurs WHERE username = 'admin';
SELECT username FROM utilisateurs WHERE username = 'votre_username'
UNION
SELECT username FROM chauffeurs WHERE username = 'votre_username';
# Dans le dossier backend
npm run dev
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taxi_transportdange
DB_USER=postgres
DB_PASSWORD=votre_password

# JWT
JWT_SECRET=votre_secret_jwt_tres_secure_123456

# Server
PORT=5000
NODE_ENV=development
# Dans le dossier backend
npm run init-db
# Dans le dossier backend
npm run init-db
# 1. Cloner le repo
git clone https://github.com/taxidange28-cloud/taxi-transportdange.git
cd taxi-transportdange

# 2. Installer les dépendances backend
cd backend
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditez . env avec vos valeurs

# 4. Initialiser la base de données
npm run init-db

# 5. Démarrer le backend
npm run dev

# 6. Dans un autre terminal, installer et démarrer le frontend
cd ../frontend
npm install
npm run dev

# 7. Accéder au panneau admin
# http://localhost:5173/admin/login
# Username: admin
# Password: Admin2026Secure!
# Dans backend/
npm run dev
curl -H "Authorization: Bearer VOTRE_TOKEN" \
     http://localhost:5000/api/admin/stats

---

### **4️⃣ COMMITER LE FICHIER**

1. **Scrollez en bas de la page**
2. **Dans "Commit message"**, écrivez :
3. **Sélectionnez** :  "Commit directly to the `feature/admin-panel-complete` branch"
4. **Cliquez sur "Commit new file"**

---

### **5️⃣ VÉRIFIER QUE LE FICHIER EST CRÉÉ**

1. **Revenez sur la Pull Request #8**
2. **Vérifiez** que le nouveau commit apparaît
3. **Le fichier `documentation/ADMIN.md` devrait être visible**

---

### **6️⃣ MERGER LA PULL REQUEST**

Maintenant que les 9 fichiers sont complets : 

1. **Cliquez sur "Merge pull request"**
2. **Confirmez le merge**
3. **🎉 C'EST FINI !**

---

## 📊 **RÉSULTAT FINAL :**
