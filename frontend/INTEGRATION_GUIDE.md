# Guide d'Utilisation - Notifications et Socket.io

## 🔔 NotificationToast Component

### Usage Simple

```jsx
import NotificationToast from '../components/Common/NotificationToast';

function MyComponent() {
  const [showToast, setShowToast] = useState(false);

  return (
    <>
      <button onClick={() => setShowToast(true)}>
        Afficher notification
      </button>
      
      {showToast && (
        <NotificationToast
          type="success"
          message="Mission créée avec succès !"
          onClose={() => setShowToast(false)}
          duration={5000}
        />
      )}
    </>
  );
}
```

### Types de Notifications

- `success` - ✅ Succès (vert)
- `error` - ❌ Erreur (rouge)
- `warning` - ⚠️ Avertissement (orange)
- `info` - ℹ️ Information (bleu)

### Usage avec Hook personnalisé

```jsx
import { useToast, ToastContainer } from '../components/Common/NotificationToast';

function App() {
  const { toasts, showToast, removeToast } = useToast();

  const handleAction = () => {
    showToast('Action réussie !', 'success');
  };

  return (
    <div>
      <button onClick={handleAction}>Action</button>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
```

## 🔌 Socket.io Service

### Configuration Automatique

Le service Socket.io se connecte automatiquement lors de la connexion utilisateur via `AuthContext`.

### Events Mission Disponibles

- `mission:nouvelle` - Nouvelle mission créée
- `mission:confirmee` - Mission confirmée par chauffeur
- `mission:assignee` - Mission assignée à un chauffeur
- `mission:modifiee` - Mission modifiée

### Exemple d'Intégration Complète

```jsx
import React, { useEffect } from 'react';
import { useToast, ToastContainer } from '../components/Common/NotificationToast';
import socketService from '../services/socket';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { toasts, showToast, removeToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'secretaire') {
      // Secrétaire reçoit les alertes
      socketService.setupMissionListeners({
        onNewMission: (mission) => {
          showToast(`📋 Nouvelle mission: ${mission.client}`, 'info', 7000);
        },
        onConfirmedMission: (mission) => {
          showToast(`✅ Mission confirmée par ${mission.chauffeur}`, 'success');
        },
      });
    } else if (user?.role === 'chauffeur') {
      // Chauffeur reçoit ses missions
      socketService.setupMissionListeners({
        onAssignedMission: (mission) => {
          showToast(
            `🚕 Nouvelle mission assignée: ${mission.client}`,
            'info',
            10000
          );
        },
        onModifiedMission: (mission) => {
          showToast(`⚠️ Mission modifiée: ${mission.client}`, 'warning');
        },
      });
    }

    return () => {
      // Cleanup listeners si nécessaire
    };
  }, [user]);

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Votre contenu */}
      
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
```

## 📊 Export Excel

### Usage dans ListeMissions

L'export Excel est déjà implémenté dans `ListeMissions.jsx`:

```jsx
const handleExportExcel = async () => {
  setExporting(true);
  try {
    const response = await api.get('/export/excel', {
      params: filters,
      responseType: 'blob'
    });
    
    // Téléchargement automatique
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `missions-${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    alert('✅ Export Excel réussi !');
  } catch (error) {
    console.error('Erreur export:', error);
    alert('❌ Erreur lors de l\'export Excel');
  } finally {
    setExporting(false);
  }
};
```

## 🎨 Palette de Couleurs

Les couleurs sont définies dans `src/index.css`:

```css
--color-primary: #7CB992         /* Vert nature moyen */
--color-primary-light: #A8D5BA   /* Vert pastel clair */
--color-primary-dark: #4A7C59    /* Vert foncé accent */
--color-secondary: #E8F0ED       /* Gris-vert très clair */
--color-background: #F8FAF9      /* Blanc cassé naturel */
--color-accent: #5DBD58          /* Vert vif pour CTA */
--color-success: #66BB6A         /* Vert succès */
--color-warning: #FFA726         /* Orange avertissement */
--color-error: #EF5350           /* Rouge erreur */
--color-info: #42A5F5            /* Bleu information */
```

### Usage dans Tailwind

```jsx
<div className="bg-primary text-white">Bouton</div>
<div className="bg-primary-light">Background clair</div>
<div className="text-primary-dark">Texte foncé</div>
```

## 🖼️ Logo Component

### Usage

```jsx
import Logo from '../components/Common/Logo';

// Tailles: 'sm', 'md', 'lg', 'xl'
<Logo size="md" showText={true} />

// Sans texte (icône seule)
<Logo size="sm" showText={false} />
```

### Responsive

Le logo s'adapte automatiquement:
- Mobile: Texte raccourci "DanGE"
- Desktop: Texte complet "Transport DanGE"
- Sous-titre "Taxi Dunois" visible uniquement sur desktop

## 📱 Responsive Design

Le layout est entièrement responsive:

- **Mobile**: Sidebar devient drawer avec bouton menu flottant
- **Tablette/Desktop**: Sidebar fixe à gauche
- **Grilles**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Spacing**: `p-4 sm:p-6 lg:p-8`

## 🚀 Démarrage

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Linting
npm run lint
```

## ✅ Tests

Vérifications à effectuer:

- [ ] Logo visible sur toutes les pages
- [ ] Couleurs vert pastel appliquées
- [ ] Notifications toast fonctionnelles
- [ ] Socket.io connecté (check console)
- [ ] Export Excel fonctionne
- [ ] Responsive sur mobile/desktop
- [ ] Favicon visible dans l'onglet
