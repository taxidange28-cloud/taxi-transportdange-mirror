# 07 - Guide Utilisateur Secrétaire

Guide d'utilisation de l'interface secrétaire Transport DanGE.

## 🔐 Connexion

1. Ouvrir: `https://planning.transportdange.fr`
2. Username: `Secretaire`
3. Mot de passe: `ChangezMoi123!` (à changer!)
4. Cliquer sur "Se connecter"

## 📋 Interface Principale

### En-tête
- Logo Transport DanGE
- Nom d'utilisateur
- Bouton Déconnexion

### Barre d'Actions
- **➕ Nouvelle Mission**: Créer une mission
- **📊 Export Excel**: Exporter les missions

### Filtres
- **Aujourd'hui**: Missions du jour
- **Demain**: Missions de demain
- **Semaine**: Missions des 7 prochains jours

### Indicateurs
- **X brouillon(s)**: Missions non envoyées
- **🔄**: Rafraîchir manuellement

## ➕ Créer une Mission

### Formulaire
1. Cliquer sur "➕ Nouvelle Mission"
2. Remplir les champs:
   - **Date**: Date de la course
   - **Heure prévue**: Heure du RDV
   - **Client**: Nom du client
   - **Type**: CPAM ou Privé
   - **Départ**: Adresse complète
   - **Arrivée**: Adresse complète
   - **Chauffeur**: Sélectionner (ou laisser vide)
   - **Notes**: Informations complémentaires

### Deux Options

**📥 ENREGISTRER (Brouillon)**
- Mission sauvegardée mais NON visible chauffeur
- Peut être modifiée librement
- À envoyer plus tard

**📲 ENVOYER MAINTENANT**
- Mission envoyée immédiatement
- Notification push au chauffeur
- Visible dans son app

## 📤 Envoyer les Missions

### Envoi Individuel
- Cliquer sur **✉️** sur la carte mission
- Confirmation automatique
- Notification envoyée

### Envoi Groupé par Date
- Bouton **✉️ ENVOYER TOUTES LES MISSIONS (X)**
- Envoie toutes les missions en brouillon d'une date
- **Usage typique**: Le soir pour le lendemain

**Exemple**: Jeudi soir 18h00 → Envoyer toutes les missions du vendredi

## 🎨 Statuts des Missions

- ⚪ **Brouillon**: Non envoyée (invisible chauffeur)
- 🔵 **Envoyée**: Envoyée, en attente de confirmation
- 🟡 **Confirmée**: Lue par le chauffeur
- 🔴 **En cours**: Prise en charge (client à bord)
- 🟢 **Terminée**: Mission terminée

## 📝 Modifier une Mission

### Méthodes
1. Cliquer sur la carte mission
2. Bouton **✏️ Modifier**

### Limitations
- ✅ **Modifiable**: Brouillon, Envoyée, Confirmée
- ❌ **NON modifiable**: En cours (🔴), Terminée (🟢)

**Pourquoi?** Un client à bord ne peut pas voir sa mission changée!

### Modifications Possibles
- Changer l'heure
- Changer le chauffeur (réassignation)
- Modifier adresses
- Ajouter/modifier notes

## 🗑️ Supprimer une Mission

1. Cliquer sur **🗑️** sur la carte
2. **Pas de confirmation** (suppression rapide)
3. Notification envoyée au chauffeur si mission envoyée

## 👀 Détails d'une Mission

Cliquer sur une carte mission pour voir:
- Toutes les informations
- Statut actuel coloré
- Heures PEC et dépose (si applicable)
- **Commentaire chauffeur** (temps réel)
- Durée calculée automatiquement

## 💬 Commentaires Chauffeurs

Les chauffeurs peuvent ajouter des commentaires:
- Visibles en **temps réel** dans la popup
- Couleur orange pour attirer l'attention
- Exemples: "Client absent", "Adresse incorrecte", "Retard"

## 📊 Export Excel

### Utilisation
1. Cliquer sur **📊 Export Excel**
2. Sélectionner période (dates déjà filtrées)
3. Fichier téléchargé automatiquement

### Contenu
- Date, Heure, Client, Type
- Départ, Arrivée, Chauffeur
- Statut, Heures PEC/Dépose
- Durée en minutes
- Commentaire

### Usage
- Comptabilité mensuelle
- Statistiques
- Facturation CPAM

## 🔄 Temps Réel

L'interface se met à jour **automatiquement**:
- Nouveaux statuts chauffeurs
- Nouveaux commentaires
- Modifications
- Suppressions

Pas besoin de recharger la page!

## 🎯 Workflow Typique

### Le Soir (pour le Lendemain)

1. **Créer toutes les missions** en brouillon
2. **Vérifier** les informations
3. **Modifier** si nécessaire
4. **Envoyer toutes les missions du lendemain** en un clic
5. Chauffeurs reçoivent notifications

### Le Jour Même

1. **Suivre l'avancement** en temps réel
2. **Lire les commentaires** chauffeurs
3. **Gérer les urgences** (réassignation)
4. **Missions de dernière minute**: Envoyer immédiatement

## 🔐 Sécurité

### Changer le Mot de Passe

⚠️ **À FAIRE EN PRIORITÉ!**

Contacter l'administrateur système pour changer:
`ChangezMoi123!` → Mot de passe fort

### Déconnexion

Toujours se déconnecter en quittant:
- Bouton en haut à droite
- Sécurise l'accès

## ➡️ Prochaine Étape

Guide chauffeur:
📄 **08-GUIDE-UTILISATEUR-CHAUFFEUR.md**
