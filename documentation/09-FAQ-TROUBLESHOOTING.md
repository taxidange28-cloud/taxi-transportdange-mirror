# 09 - FAQ et Dépannage

Questions fréquentes et solutions aux problèmes courants.

## 🔐 Connexion et Authentification

### Q: J'ai oublié mon mot de passe
**R:** Contacter l'administrateur système. Il n'y a pas de réinitialisation automatique pour des raisons de sécurité.

### Q: "Identifiants invalides"
**R:** Vérifier:
- Majuscules/minuscules (sensible à la casse)
- Espaces en trop
- Username correct (Secrétaire, patron, franck, laurence, autre)

### Q: Déconnecté automatiquement
**R:** Normal, le token JWT expire après 7 jours. Se reconnecter.

## 📱 Application Chauffeur (PWA)

### Q: L'app ne s'installe pas
**R:** Solutions:
1. Utiliser Chrome sur Android (pas Firefox)
2. Utiliser Safari sur iOS
3. Vérifier HTTPS actif sur le domaine
4. Vider cache navigateur
5. Redémarrer le téléphone

### Q: Pas de bouton "Ajouter à l'écran d'accueil"
**R:** L'app est peut-être déjà installée. Vérifier l'écran d'accueil.

### Q: App se déconnecte souvent
**R:** 
- Normal après 7 jours (expiration token)
- Vérifier connexion Internet stable
- Réinstaller l'app si problème persiste

## 🔔 Notifications Push

### Q: Je ne reçois pas de notifications
**R:** Checklist:
1. ✅ Autorisation app accordée
2. ✅ Autorisation système Android/iOS
3. ✅ Mode Ne pas déranger désactivé
4. ✅ Son activé
5. ✅ Connexion Internet
6. ✅ App installée (pas juste marque-page)

**Solution:**
- Se déconnecter
- Fermer l'app complètement
- Rouvrir et se reconnecter
- Réautoriser notifications

### Q: Notifications en retard
**R:** 
- Normal si pas de réseau (arrivée à la reconnexion)
- Vérifier que l'app n'est pas en économie d'énergie
- Android: Paramètres → Batterie → Désactiver optimisation pour l'app

### Q: Son de notification trop fort/faible
**R:** Régler dans Paramètres → Sons → Notifications

## 📋 Missions

### Q: Mission envoyée mais pas visible
**R:** Vérifier:
1. Connecté avec bon compte chauffeur
2. Mission bien assignée à vous
3. Mission envoyée (pas brouillon)
4. Recharger: tirer vers le bas
5. Vérifier date de la mission

### Q: Bouton "Confirmer" grisé
**R:** Normal si:
- Mission déjà confirmée (🟡)
- Mission en PEC (🔴)
- Mission terminée (🟢)

### Q: Impossible de modifier une mission
**R:** Seule la secrétaire peut modifier. Chauffeurs peuvent uniquement:
- Confirmer
- Prendre en charge
- Terminer
- Commenter

### Q: Erreur "Mission introuvable"
**R:** 
- Mission supprimée par secrétaire
- Problème de synchronisation
- Recharger l'app

## ⏰ Horodatage

### Q: Heure PEC incorrecte
**R:** L'heure est celle du serveur (précise). Pas modifiable après coup.

### Q: Oublié de faire PEC
**R:** Impossible de corriger après. Contacter la secrétaire pour note.

### Q: Durée calculée fausse
**R:** Durée = Heure dépose - Heure PEC. Automatique et précis.

## 🌐 Connexion et Réseau

### Q: "Erreur serveur"
**R:** 
1. Vérifier connexion Internet
2. Réessayer dans quelques secondes
3. Si persiste: contacter administrateur

### Q: "Erreur CORS" ou "Failed to fetch"
**R:** Problème backend. Contacter administrateur.

### Q: Lenteur de l'app
**R:** 
- Vérifier connexion Internet
- Fermer/rouvrir l'app
- Vider cache navigateur
- Redémarrer téléphone

## 💾 Données et Cache

### Q: Vider le cache
**Android:**
- Paramètres → Applications → Transport DanGE
- Stockage → Vider le cache

**iOS:**
- Réglages → Safari
- Effacer historique et données

### Q: Taille de l'app augmente
**R:** Normal, cache des missions et images. Vider si trop grand.

### Q: Perte de données hors ligne
**R:** 
- Actions hors ligne pas sauvegardées
- Toujours effectuer actions avec réseau
- Consultation possible hors ligne

## 🔄 Mise à Jour

### Q: Nouvelle version disponible
**R:** 
- Fermer complètement l'app
- Rouvrir
- Mise à jour automatique

### Q: Forcer la mise à jour
**R:** 
1. Ouvrir l'app
2. Tirer vers le bas pour recharger
3. Ou: Désinstaller et réinstaller

## 📊 Interface Secrétaire

### Q: Mission ne passe pas à "Confirmée"
**R:** Le chauffeur doit cliquer sur "Confirmer réception" dans son app.

### Q: Temps réel ne fonctionne pas
**R:** 
- Recharger la page
- Vérifier connexion Internet
- Vider cache navigateur

### Q: Export Excel vide
**R:** 
- Vérifier filtres de date
- Vérifier qu'il y a des missions dans période
- Réessayer

### Q: Impossible de modifier mission PEC
**R:** Normal et volontaire. Client à bord = mission figée.

## 🔒 Sécurité

### Q: Compte bloqué
**R:** Après 10 tentatives de connexion échouées. Contacter administrateur.

### Q: Token FCM expiré
**R:** Se déconnecter et reconnecter. Nouveau token généré.

### Q: Connexion HTTPS non sécurisée
**R:** Vérifier SSL actif. Contacter administrateur si problème.

## 🚨 Problèmes Critiques

### Backend ne répond pas
```bash
# Admin: Vérifier PM2
pm2 status
pm2 logs transport-dange-backend
pm2 restart transport-dange-backend
```

### Base de données corrompue
```bash
# Admin: Restaurer backup
psql -U transport_dange transport_dange < backup_YYYYMMDD.sql
```

### Certificat SSL expiré
```bash
# Admin: Renouveler
sudo certbot renew
sudo systemctl reload nginx
```

## 📞 Contact Support

### Pour Utilisateurs
1. Consulter ce guide
2. Contacter la secrétaire
3. Si technique: administrateur système

### Pour Administrateur
**Email support:** support@transportdange.fr  
**Urgences:** 24/7

## 🛠️ Outils de Diagnostic

### Test Connexion API
```bash
curl https://api.transportdange.fr/api/health
```

### Test SSL
https://www.ssllabs.com/ssltest/

### Test PWA
Chrome DevTools → Lighthouse → Progressive Web App

### Test Notifications
Chrome DevTools → Application → Service Workers

## ✅ Checklist Dépannage

Avant d'appeler le support:

- [ ] Vérifier connexion Internet
- [ ] Essayer sur autre appareil
- [ ] Vider cache navigateur
- [ ] Redémarrer appareil
- [ ] Vérifier HTTPS actif
- [ ] Consulter cette FAQ
- [ ] Noter message d'erreur exact

## 📚 Documentation Complète

- **01**: Installation Serveur
- **02**: Configuration Firebase
- **03**: Déploiement Backend
- **04**: Déploiement Frontend
- **05**: Configuration Domaine
- **06**: Installation PWA
- **07**: Guide Secrétaire
- **08**: Guide Chauffeur
- **09**: Cette FAQ

---

**Version:** 1.0.0  
**Dernière mise à jour:** Décembre 2024  
**Transport DanGE** - Taxi Dunois, Eure-et-Loir
