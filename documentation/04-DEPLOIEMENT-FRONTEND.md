# 04 - Déploiement des Frontends

Guide pour déployer les applications frontend (Secrétaire et Chauffeur).

## 🖥️ Frontend Secrétaire

### 1. Configuration

```bash
cd /var/www/transport-dange/frontend-secretaire
cp .env.example .env
nano .env
```

```env
REACT_APP_API_URL=https://api.transportdange.fr/api
```

### 2. Build

```bash
npm install
npm run build
```

### 3. Configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/transport-dange-secretaire
```

```nginx
server {
    listen 80;
    server_name planning.transportdange.fr;
    root /var/www/transport-dange/frontend-secretaire/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/transport-dange-secretaire /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. SSL

```bash
sudo certbot --nginx -d planning.transportdange.fr
```

## 📱 Frontend Chauffeur (PWA)

### 1. Configuration

```bash
cd /var/www/transport-dange/frontend-chauffeur
cp .env.example .env
nano .env
```

```env
REACT_APP_API_URL=https://api.transportdange.fr/api
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=transport-dange.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=transport-dange
REACT_APP_FIREBASE_STORAGE_BUCKET=transport-dange.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
REACT_APP_FIREBASE_VAPID_KEY=BNx...
```

### 2. Configurer Firebase Service Worker

```bash
nano public/firebase-messaging-sw.js
```

Remplacer la configuration Firebase par vos vraies valeurs.

### 3. Build

```bash
npm install
npm run build
```

### 4. Configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/transport-dange-chauffeur
```

```nginx
server {
    listen 80;
    server_name chauffeur.transportdange.fr;
    root /var/www/transport-dange/frontend-chauffeur/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Service Worker
    location /service-worker.js {
        add_header Cache-Control "no-cache";
        try_files $uri =404;
    }

    location /firebase-messaging-sw.js {
        add_header Cache-Control "no-cache";
        try_files $uri =404;
    }

    # Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # manifest.json
    location /manifest.json {
        add_header Content-Type application/json;
        add_header Cache-Control "no-cache";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/transport-dange-chauffeur /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL (OBLIGATOIRE pour PWA)

```bash
sudo certbot --nginx -d chauffeur.transportdange.fr
```

⚠️ **HTTPS est OBLIGATOIRE** pour:
- Service Workers
- Firebase Cloud Messaging
- Installation PWA

## ✅ Vérification

### Test Frontend Secrétaire

1. Ouvrir https://planning.transportdange.fr
2. Se connecter: `Secretaire / ChangezMoi123!`
3. Créer une mission test
4. Vérifier le temps réel

### Test Frontend Chauffeur

1. Ouvrir https://chauffeur.transportdange.fr
2. Se connecter: `patron / ChangezMoi123!`
3. Autoriser les notifications
4. Vérifier réception mission test
5. Tester installation PWA

## 🔄 Mise à Jour

```bash
# Backend
cd /var/www/transport-dange/backend
git pull
npm install
pm2 restart transport-dange-backend

# Frontend Secrétaire
cd /var/www/transport-dange/frontend-secretaire
git pull
npm install
npm run build

# Frontend Chauffeur
cd /var/www/transport-dange/frontend-chauffeur
git pull
npm install
npm run build
```

## 📊 Optimisation

### Compression Nginx

```nginx
# Dans /etc/nginx/nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript 
           application/x-javascript application/xml+rss 
           application/javascript application/json;
```

### Cache

Les assets statiques sont mis en cache pour 1 an.
Service workers et manifest.json ne sont pas mis en cache.

## ➡️ Prochaine Étape

Configurer les DNS:
📄 **05-CONFIGURATION-DOMAINE.md**
