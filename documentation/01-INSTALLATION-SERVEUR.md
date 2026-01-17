# 01 - Installation du Serveur

Guide d'installation du serveur pour Transport DanGE.

## 🎯 Prérequis Serveur

### Serveur Ionos (ou équivalent)

- **Type**: VPS ou hébergement mutualisé
- **Système**: Linux (Ubuntu 20.04+ ou Debian 11+)
- **RAM**: Minimum 2 GB
- **Espace disque**: Minimum 10 GB
- **Accès**: SSH (root ou sudo)

## 📦 Logiciels Requis

### 1. Node.js (version 16 ou supérieure)

```bash
# Mise à jour du système
sudo apt update
sudo apt upgrade -y

# Installation de Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Vérification
node --version
npm --version
```

### 2. PostgreSQL (version 12 ou supérieure)

```bash
# Installation de PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Démarrer le service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Vérification
sudo -u postgres psql --version
```

### 3. Nginx (serveur web)

```bash
# Installation de Nginx
sudo apt install -y nginx

# Démarrer le service
sudo systemctl start nginx
sudo systemctl enable nginx

# Vérification
sudo systemctl status nginx
```

### 4. Git

```bash
# Installation de Git
sudo apt install -y git

# Vérification
git --version
```

### 5. Certbot (SSL gratuit)

```bash
# Installation de Certbot pour SSL
sudo apt install -y certbot python3-certbot-nginx

# Vérification
certbot --version
```

## 🔒 Configuration SSH

### Connexion SSH

```bash
# Depuis votre machine locale
ssh root@votre-serveur.com
# ou
ssh utilisateur@votre-serveur.com
```

### Créer un utilisateur (recommandé)

```bash
# En tant que root
adduser transportdange
usermod -aG sudo transportdange

# Basculer vers le nouvel utilisateur
su - transportdange
```

## 📁 Structure des Répertoires

```bash
# Créer les répertoires de l'application
sudo mkdir -p /var/www/transport-dange
sudo chown -R $USER:$USER /var/www/transport-dange

# Structure
# /var/www/transport-dange/
# ├── backend/
# ├── frontend-secretaire/
# └── frontend-chauffeur/
```

## 🔐 Configuration PostgreSQL

### Créer un utilisateur et une base de données

```bash
# Se connecter en tant que postgres
sudo -u postgres psql

# Dans le shell PostgreSQL
CREATE USER transport_dange WITH PASSWORD 'MOT_DE_PASSE_FORT';
CREATE DATABASE transport_dange OWNER transport_dange;
GRANT ALL PRIVILEGES ON DATABASE transport_dange TO transport_dange;

# Quitter
\q
```

### Configurer l'accès distant (optionnel)

```bash
# Éditer pg_hba.conf
sudo nano /etc/postgresql/12/main/pg_hba.conf

# Ajouter cette ligne pour autoriser l'accès local
# host    transport_dange    transport_dange    127.0.0.1/32    md5

# Redémarrer PostgreSQL
sudo systemctl restart postgresql
```

## 🔥 Configuration du Pare-feu

```bash
# Autoriser les ports nécessaires
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Backend API (temporaire)

# Activer le pare-feu
sudo ufw enable
sudo ufw status
```

## 🚀 Installation de PM2 (Process Manager)

```bash
# Installation globale de PM2
sudo npm install -g pm2

# Configuration pour démarrage automatique
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

# Vérification
pm2 --version
```

## ✅ Vérification de l'Installation

### Checklist

- [x] Node.js installé et fonctionnel
- [x] PostgreSQL installé et base de données créée
- [x] Nginx installé et démarré
- [x] Git installé
- [x] Certbot installé pour SSL
- [x] PM2 installé
- [x] Pare-feu configuré
- [x] Accès SSH fonctionnel
- [x] Répertoires créés avec permissions correctes

### Commandes de vérification

```bash
# Vérifier les services
sudo systemctl status postgresql
sudo systemctl status nginx

# Vérifier Node.js
node --version
npm --version

# Vérifier PM2
pm2 --version

# Vérifier la base de données
sudo -u postgres psql -c "SELECT version();"
```

## 📝 Notes Importantes

1. **Sécurité**:
   - Utilisez des mots de passe forts
   - Configurez fail2ban pour protection SSH
   - Mettez à jour régulièrement le système

2. **Sauvegarde**:
   - Configurez des sauvegardes automatiques de la base de données
   - Sauvegardez les fichiers de configuration

3. **Monitoring**:
   - Installez des outils de monitoring (htop, netdata)
   - Configurez des alertes email

## 🔍 Dépannage

### PostgreSQL ne démarre pas

```bash
sudo systemctl status postgresql
sudo journalctl -u postgresql
```

### Nginx ne démarre pas

```bash
sudo nginx -t
sudo systemctl status nginx
```

### Erreur de permissions

```bash
sudo chown -R $USER:$USER /var/www/transport-dange
```

## ➡️ Prochaine Étape

Une fois le serveur configuré, passez au guide suivant:
📄 **02-CONFIGURATION-FIREBASE.md**
