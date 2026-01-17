# 05 - Configuration du Domaine

Guide pour configurer les DNS et domaines chez Ionos.

## 🌐 Domaines Nécessaires

- `planning.transportdange.fr` - Frontend Secrétaire
- `chauffeur.transportdange.fr` - Frontend Chauffeur (PWA)
- `api.transportdange.fr` - Backend API

## 📝 Configuration DNS chez Ionos

### 1. Accéder à la Gestion DNS

1. Se connecter à Ionos
2. Aller dans "Domaines & SSL"
3. Sélectionner `transportdange.fr`
4. Cliquer sur "Gérer les sous-domaines"

### 2. Créer les Sous-Domaines

**Pour planning.transportdange.fr:**
- Type: A
- Nom: planning
- Valeur: ADRESSE_IP_SERVEUR
- TTL: 3600

**Pour chauffeur.transportdange.fr:**
- Type: A
- Nom: chauffeur
- Valeur: ADRESSE_IP_SERVEUR
- TTL: 3600

**Pour api.transportdange.fr:**
- Type: A
- Nom: api
- Valeur: ADRESSE_IP_SERVEUR
- TTL: 3600

### 3. Propager les DNS

⏳ Propagation: 5 minutes à 48 heures (généralement ~1 heure)

Vérifier la propagation:
```bash
nslookup planning.transportdange.fr
nslookup chauffeur.transportdange.fr
nslookup api.transportdange.fr
```

## 🔒 Certificats SSL (Let's Encrypt)

### Installation Automatique

```bash
# Planning (Secrétaire)
sudo certbot --nginx -d planning.transportdange.fr

# Chauffeur (PWA) - OBLIGATOIRE
sudo certbot --nginx -d chauffeur.transportdange.fr

# API
sudo certbot --nginx -d api.transportdange.fr
```

### Renouvellement Automatique

Let's Encrypt configure automatiquement le renouvellement.

Tester le renouvellement:
```bash
sudo certbot renew --dry-run
```

Vérifier le timer systemd:
```bash
sudo systemctl status certbot.timer
```

## ✅ Vérification

### Test des URLs

```bash
# Secrétaire
curl -I https://planning.transportdange.fr

# Chauffeur
curl -I https://chauffeur.transportdange.fr

# API
curl https://api.transportdange.fr/api/health
```

### Test SSL

Utiliser: https://www.ssllabs.com/ssltest/

Objectif: Note A ou A+

## 🔄 Redirection HTTP → HTTPS

Nginx configure automatiquement les redirections avec Certbot.

Vérifier:
```bash
curl -I http://planning.transportdange.fr
# Doit retourner: 301 Moved Permanently
```

## 🌍 Configuration CORS

Dans backend/.env:
```env
CORS_ORIGINS=https://planning.transportdange.fr,https://chauffeur.transportdange.fr
```

Redémarrer le backend:
```bash
pm2 restart transport-dange-backend
```

## 📱 PWA - Domaine Obligatoire

⚠️ **IMPORTANT**: Le frontend chauffeur **DOIT** être sur HTTPS pour:
- Installation PWA
- Service Worker
- Notifications Push
- Géolocalisation

## 🚨 Dépannage

### DNS ne se résout pas

```bash
# Vérifier DNS
dig planning.transportdange.fr

# Flush DNS local
sudo systemd-resolve --flush-caches
```

### SSL ne fonctionne pas

```bash
# Vérifier Certbot
sudo certbot certificates

# Renouveler manuellement
sudo certbot renew
```

### Erreur CORS

Vérifier:
1. CORS_ORIGINS dans backend/.env
2. Redémarrage du backend
3. Cache navigateur vidé

## ➡️ Prochaine Étape

Guide d'installation PWA:
📄 **06-INSTALLATION-PWA.md**
