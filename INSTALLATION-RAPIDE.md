# ⚡ Installation Rapide - Transport DanGE

Guide d'installation express pour déployer l'application complète.

## 🎯 Prérequis

- Serveur Linux (Ubuntu 20.04+)
- Accès SSH root
- Domaine configuré (transportdange.fr)

## 🚀 Installation en 5 Étapes

### 1️⃣ Installer les Dépendances (10 min)

```bash
# Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Nginx + Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# PM2
sudo npm install -g pm2

# Git
sudo apt install -y git
```

### 2️⃣ Configuration Base de Données (5 min)

```bash
# Créer utilisateur et base
sudo -u postgres psql << EOF
CREATE USER transport_dange WITH PASSWORD 'VOTRE_MOT_DE_PASSE';
CREATE DATABASE transport_dange OWNER transport_dange;
GRANT ALL PRIVILEGES ON DATABASE transport_dange TO transport_dange;
\q
EOF
```

### 3️⃣ Déployer le Backend (10 min)

```bash
# Cloner le projet
sudo mkdir -p /var/www/transport-dange
cd /var/www/transport-dange
git clone https://github.com/VOTRE-COMPTE/taxi-transportdange.git .

# Backend
cd backend
npm install --production

# Configuration
cp .env.example .env
nano .env  # Éditer avec vos valeurs

# Initialiser DB
npm run init-db

# Démarrer avec PM2
pm2 start src/server.js --name transport-dange-backend
pm2 save
```

### 4️⃣ Déployer les Frontends (15 min)

```bash
# Frontend Secrétaire
cd /var/www/transport-dange/frontend-secretaire
cp .env.example .env
nano .env  # REACT_APP_API_URL=https://api.transportdange.fr/api
npm install
npm run build

# Frontend Chauffeur
cd /var/www/transport-dange/frontend-chauffeur
cp .env.example .env
nano .env  # Ajouter configuration Firebase
npm install
npm run build
```

### 5️⃣ Configurer Nginx + SSL (10 min)

```bash
# Créer configs Nginx
sudo nano /etc/nginx/sites-available/transport-dange-api
# Copier config API du guide 03

sudo nano /etc/nginx/sites-available/transport-dange-secretaire
# Copier config secrétaire du guide 04

sudo nano /etc/nginx/sites-available/transport-dange-chauffeur
# Copier config chauffeur du guide 04

# Activer sites
sudo ln -s /etc/nginx/sites-available/transport-dange-* /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL automatique
sudo certbot --nginx -d api.transportdange.fr
sudo certbot --nginx -d planning.transportdange.fr
sudo certbot --nginx -d chauffeur.transportdange.fr
```

## ✅ Vérification

```bash
# API
curl https://api.transportdange.fr/api/health

# Secrétaire
curl -I https://planning.transportdange.fr

# Chauffeur
curl -I https://chauffeur.transportdange.fr
```

## 🔐 Premières Connexions

### Secrétaire
- URL: https://planning.transportdange.fr
- User: `Secretaire`
- Pass: `ChangezMoi123!`

### Chauffeur
- URL: https://chauffeur.transportdange.fr
- User: `patron` / `franck` / `laurence` / `autre`
- Pass: `ChangezMoi123!`

## 🎉 C'est Fini!

Temps total: ~50 minutes

## 📚 Documentation Complète

Pour plus de détails, consulter:
- **01-INSTALLATION-SERVEUR.md**
- **02-CONFIGURATION-FIREBASE.md**
- **03-DEPLOIEMENT-BACKEND.md**
- **04-DEPLOIEMENT-FRONTEND.md**
- **05-CONFIGURATION-DOMAINE.md**

## 🔄 Commandes Utiles

```bash
# Logs backend
pm2 logs transport-dange-backend

# Redémarrer backend
pm2 restart transport-dange-backend

# Logs Nginx
sudo tail -f /var/log/nginx/error.log

# Mise à jour application
cd /var/www/transport-dange
git pull
cd backend && npm install && pm2 restart transport-dange-backend
cd ../frontend-secretaire && npm install && npm run build
cd ../frontend-chauffeur && npm install && npm run build
```

## 🚨 Problème?

Consulter **09-FAQ-TROUBLESHOOTING.md**

---

**Temps estimé:** 50 minutes  
**Difficulté:** Moyen  
**Support:** documentation/
