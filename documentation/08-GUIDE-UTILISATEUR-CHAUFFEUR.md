# 08 - Guide Utilisateur Chauffeur

Guide d'utilisation de l'application chauffeur Transport DanGE.

## 📱 Première Installation

Voir guide: **06-INSTALLATION-PWA.md**

## 🔐 Première Connexion

1. Ouvrir l'app depuis l'écran d'accueil
2. Username: `patron` / `franck` / `laurence` / `autre`
3. Mot de passe: `ChangezMoi123!`
4. **IMPORTANT**: Autoriser les notifications!

## 🏠 Écran Principal

### En-tête
- Logo Transport DanGE
- Votre nom
- Bouton Déconnexion

### Liste des Missions
- Groupées par date
- Uniquement les missions **envoyées**
- Badge **NOUVEAU** sur missions non lues

## 🔔 Recevoir une Mission

### Notification
- **Son** + **Vibration**
- Titre: "📲 Nouvelle mission"
- Corps: Heure - Client - Type
- Même app fermée!

### Dans l'App
- Badge rouge **NOUVEAU**
- Mission en haut de liste
- Statut 🔵 **Envoyée**

## 📋 Carte Mission

### Informations
- **Heure**: Heure du RDV
- **Client**: Nom
- **Type**: CPAM ou Privé
- **Départ**: Adresse complète
- **Arrivée**: Adresse complète

### Bouton "Plus"
Voir détails supplémentaires:
- Véhicule assigné
- Notes secrétaire
- Heures PEC/Dépose
- Votre commentaire

## ✅ Confirmer Réception

**Quand?** Dès réception (🔵)

**Comment?**
1. Ouvrir la mission
2. Bouton **✓ Confirmer Réception**
3. Statut passe à 🟡 **Confirmée**

**Pourquoi?**
- Secrétaire sait que vous avez vu
- Évite les doublons

## 🚗 Prise en Charge (PEC)

**Quand?** Client monte dans le taxi

**Comment?**
1. Bouton **🚗 Prise en Charge**
2. Confirmer
3. **Horodatage automatique**
4. Statut passe à 🔴 **En cours**

**Important:**
- Heure PEC enregistrée
- Visible par secrétaire
- Mission NON modifiable après PEC

## ✓ Terminer la Mission

**Quand?** Client déposé à destination

**Comment?**
1. Bouton **✓ Mission Terminée**
2. Confirmer
3. **Horodatage automatique**
4. Statut passe à 🟢 **Terminée**

**Calculs automatiques:**
- Heure de dépose
- Durée en minutes (Dépose - PEC)

## 💬 Ajouter un Commentaire

**Quand?** À tout moment (même mission terminée)

**Comment?**
1. Bouton **💬 Ajouter un Commentaire**
2. Saisir texte
3. Bouton **Envoyer**
4. Visible par secrétaire en temps réel

**Exemples:**
- "Client absent, j'attends"
- "Adresse incorrecte, j'appelle"
- "Retard 10 minutes"
- "Client annule"
- "Bagage supplémentaire"

## 🎨 Comprendre les Statuts

| Emoji | Statut | Signification | Actions |
|-------|--------|---------------|---------|
| 🔵 | Envoyée | Nouvelle mission | ✓ Confirmer, 🚗 PEC |
| 🟡 | Confirmée | Vous avez confirmé | 🚗 PEC |
| 🔴 | En cours | Client à bord | ✓ Terminer |
| 🟢 | Terminée | Mission finie | 💬 Commenter |

## 📅 Organisation

### Missions Groupées par Date
- **Aujourd'hui**: Priorité
- **Demain**: Préparation
- **Semaine**: Vue d'ensemble

### Badge NOUVEAU
- Apparaît sur missions non confirmées
- Disparaît après confirmation
- Animation clignotante

## 🔄 Mise à Jour Temps Réel

L'app se synchronise automatiquement:
- Nouvelles missions
- Modifications secrétaire
- Suppressions
- Pas besoin de recharger!

## 📱 Fonctionnalités Hors Ligne

### Cache
- Missions déjà chargées restent accessibles
- Photos et logo en cache
- Peut consulter même sans réseau

### Limitations Sans Réseau
- ❌ Pas de nouvelles missions
- ❌ Actions non synchronisées
- ✅ Consultation missions existantes

### Retour en Ligne
- Synchronisation automatique
- Actions en attente envoyées

## 🔐 Sécurité

### Changer Mot de Passe
Demander à l'administrateur de changer:
`ChangezMoi123!` → Mot de passe personnel

### Déconnexion
- Bouton en haut à droite
- Recommandé en fin de journée

### Téléphone Perdu/Volé
Contacter immédiatement la secrétaire pour:
- Désactiver votre compte
- Bloquer l'accès

## 🚨 Problèmes Courants

### Notifications ne marchent pas
1. Vérifier autorisation app
2. Vérifier autorisation système
3. Se déconnecter/reconnecter
4. Réinstaller l'app

### Mission ne s'affiche pas
1. Vérifier connexion Internet
2. Tirer vers le bas pour recharger
3. Fermer/Rouvrir l'app

### Bouton grisé/désactivé
- Normal si mauvais statut
- Exemple: PEC uniquement si 🔵 ou 🟡

### App ne s'ouvre pas
1. Vérifier connexion Internet
2. Réinstaller l'app
3. Vider cache Chrome

## 📞 Support

Problème technique?
1. Consulter **09-FAQ-TROUBLESHOOTING.md**
2. Contacter la secrétaire
3. En dernier recours: Réinstaller

## ✅ Bonnes Pratiques

1. **Confirmer rapidement** les missions reçues
2. **PEC précise** au moment exact
3. **Commenter** si problème
4. **Terminer** dès dépose client
5. **Autoriser notifications** toujours
6. **Charger l'app** chaque matin

## ➡️ Prochaine Étape

FAQ et dépannage:
📄 **09-FAQ-TROUBLESHOOTING.md**
