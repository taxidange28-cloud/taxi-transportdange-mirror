# 🔐 Configuration du Compte Administrateur

## Objectif

Ce guide explique comment créer un compte administrateur pour accéder au panneau d'administration de l'application Transport DanGE.

## Prérequis

- PostgreSQL installé et démarré
- Base de données initialisée (voir `backend/database/init.js`)
- Variables d'environnement configurées (`.env` dans le dossier `backend/`)

## Création du Compte Admin

### Méthode 1: Avec un mot de passe personnalisé (Recommandé)

```bash
cd backend
npm run create-admin -- VotreMotDePasseSecurise123!
```

### Méthode 2: Avec une variable d'environnement

```bash
cd backend
ADMIN_PASSWORD=VotreMotDePasseSecurise123! npm run create-admin
```

### Méthode 3: Avec le mot de passe par défaut (Non recommandé en production)

```bash
cd backend
npm run create-admin
```

⚠️ **Note:** Si vous n'indiquez pas de mot de passe, le mot de passe par défaut `admin77281670` sera utilisé. **Changez-le immédiatement après la première connexion!**

### Vérification

Le script affichera un message de confirmation si la création est réussie :

```
═══════════════════════════════════════════════
✅ Compte administrateur créé avec succès !
═══════════════════════════════════════════════

📋 Informations du compte:
   ID: 1
   Username: admin
   Password: ********
   Rôle: admin
   Créé le: 2024-01-01 12:00:00

⚠️  IMPORTANT: Changez le mot de passe après la première connexion!
```

## Identifiants par Défaut

| Champ | Valeur |
|-------|--------|
| **Username** | `admin` |
| **Password** | Celui que vous avez défini (ou `admin77281670` par défaut) |
| **Rôle** | `admin` |

## Connexion

1. Accédez à l'interface d'administration (URL selon votre configuration)
2. Connectez-vous avec les identifiants ci-dessus
3. **Changez immédiatement le mot de passe** pour sécuriser le compte

## Gestion des Erreurs

### Le compte admin existe déjà

Si vous voyez ce message :
```
⚠️  Un compte administrateur existe déjà!
```

Le compte admin a déjà été créé. Si vous avez oublié le mot de passe, vous devrez le réinitialiser manuellement dans la base de données ou via l'interface admin.

### Erreur de connexion à la base de données

```
❌ Erreur lors de la création du compte administrateur
```

**Solutions :**
1. Vérifiez que PostgreSQL est démarré
2. Vérifiez les variables d'environnement dans le fichier `.env`
3. Assurez-vous que la base de données existe et est accessible

### Mot de passe trop court

```
❌ Le mot de passe doit contenir au moins 8 caractères
```

Utilisez un mot de passe d'au moins 8 caractères.

## ⚠️ Sécurité

### Recommandations Importantes

1. **Utilisez un mot de passe fort** lors de la création :
   - Au moins 12 caractères
   - Lettres majuscules et minuscules
   - Chiffres
   - Caractères spéciaux
2. Ne partagez jamais vos identifiants administrateur
3. Changez le mot de passe régulièrement
4. N'utilisez pas le mot de passe par défaut en production

### Pour Changer le Mot de Passe

Une fois connecté en tant qu'administrateur, utilisez l'interface de gestion de compte pour changer votre mot de passe via l'API `/api/admin/users/:id/password`.

## Support

Pour toute question ou problème, consultez :
- La documentation principale : [README.md](../README.md)
- La FAQ : [documentation/09-FAQ-TROUBLESHOOTING.md](../documentation/09-FAQ-TROUBLESHOOTING.md)

---

**Version:** 1.0.0 | **Transport DanGE** - Dunois, Eure-et-Loir
