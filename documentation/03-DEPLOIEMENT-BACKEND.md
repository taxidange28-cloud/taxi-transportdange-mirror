# 03 - Déploiement du Backend

Guide pour déployer l'API backend sur le serveur.

## 📦 Préparation

### 1. Cloner le Repository

```bash
cd /var/www/transport-dange
git clone https://github.com/VOTRE-COMPTE/taxi-transportdange.git .
```

### 2. Installer les Dépendances Backend

```bash
cd backend
npm install --production
```

## ⚙️ Configuration

### 1. Créer le fichier .env

```bash
cp .env.example .env
nano .env
```

### 2. Configurer les Variables

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=transport_dange
DB_USER=transport_dange
DB_PASSWORD=VOTRE_MOT_DE_PASSE
JWT_SECRET=GENERER_CLE_ALEATOIRE_FORTE
JWT_EXPIRES_IN=7d
FIREBASE_PROJECT_ID=transport-dange
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@...
CORS_ORIGINS=https://planning.transportdange.fr
NODE_ENV=production
```

**Générer JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🗄️ Initialiser la Base de Données

```bash
npm run init-db
```

Cela crée:
- ✅ Toutes les tables
- ✅ Compte secrétaire: `Secretaire / ChangezMoi123!`
- ✅ Comptes chauffeurs: `patron, franck, laurence, autre / ChangezMoi123!`
- ✅ Véhicules d'exemple

## 🚀 Démarrer avec PM2

```bash
# Démarrer le backend
pm2 start src/server.js --name transport-dange-backend

# Sauvegarder la configuration
pm2 save

# Vérifier le statut
pm2 status
pm2 logs transport-dange-backend
```

## 🌐 Configuration Nginx (Reverse Proxy)

```bash
sudo nano /etc/nginx/sites-available/transport-dange-api
```

```nginx
server {
    listen 80;
    server_name api.transportdange.fr;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/transport-dange-api /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

## 🔒 Installer SSL

```bash
sudo certbot --nginx -d api.transportdange.fr
```

## ✅ Test de l'API

```bash
# Test health check
curl https://api.transportdange.fr/api/health

# Test login
curl -X POST https://api.transportdange.fr/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Secretaire","password":"ChangezMoi123!"}'
```

## 🔄 Commandes PM2 Utiles

```bash
# Voir les logs
pm2 logs transport-dange-backend

# Redémarrer
pm2 restart transport-dange-backend

# Arrêter
pm2 stop transport-dange-backend

# Supprimer
pm2 delete transport-dange-backend

# Monitoring
pm2 monit
```

## 📊 Monitoring et Logs

```bash
# Logs en temps réel
pm2 logs transport-dange-backend --lines 100

# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔐 Sécurité

1. **Changer les mots de passe par défaut**
2. **Configurer les CORS** correctement
3. **Activer fail2ban**
4. **Configurer les sauvegardes** automatiques

## 🗄️ Sauvegarde Base de Données

```bash
# Créer un backup
pg_dump -U transport_dange transport_dange > backup_$(date +%Y%m%d).sql

# Restaurer un backup
psql -U transport_dange transport_dange < backup_20231215.sql
```

## ➡️ Prochaine Étape

Déployer les frontends:
📄 **04-DEPLOIEMENT-FRONTEND.md**
