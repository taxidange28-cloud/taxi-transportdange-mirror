const { getMessaging } = require('../config/firebase');
const Chauffeur = require('../models/Chauffeur');

class NotificationService {
  // Envoyer une notification à un chauffeur
  static async envoyerNotification(chauffeurId, title, body, data = {}) {
    try {
      const chauffeur = await Chauffeur.findById(chauffeurId);
      
      if (!chauffeur || !chauffeur.fcm_token) {
        console.log(`Pas de token FCM pour le chauffeur ${chauffeurId}`);
        return null;
      }

      const messaging = getMessaging();
      if (!messaging) {
        console.warn('Firebase Messaging non disponible');
        return null;
      }

      const message = {
        token: chauffeur.fcm_token,
        notification: {
          title,
          body,
        },
        data: {
          ...data,
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'transport_dange_missions',
            priority: 'high',
            vibrate: [500, 200, 500],
          },
        },
        webpush: {
          notification: {
            icon: '/logo-192.png',
            badge: '/logo-192.png',
            vibrate: [500, 200, 500],
          },
        },
      };

      const response = await messaging.send(message);
      console.log('✅ Notification envoyée:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur envoi notification:', error);
      // Ne pas bloquer l'application si les notifications échouent
      return null;
    }
  }

  // Notifier une nouvelle mission
  static async notifierNouvelleMission(mission) {
    if (!mission.chauffeur_id) return;

    await this.envoyerNotification(
      mission.chauffeur_id,
      '📲 Nouvelle mission',
      `${mission.heure_prevue} - ${mission.client} (${mission.type})`,
      {
        type: 'nouvelle_mission',
        mission_id: mission.id.toString(),
      }
    );
  }

  // Notifier une mission modifiée
  static async notifierMissionModifiee(mission) {
    if (!mission.chauffeur_id) return;

    await this.envoyerNotification(
      mission.chauffeur_id,
      '✏️ Mission modifiée',
      `${mission.heure_prevue} - ${mission.client}`,
      {
        type: 'mission_modifiee',
        mission_id: mission.id.toString(),
      }
    );
  }

  // Notifier une mission supprimée
  static async notifierMissionSupprimee(chauffeurId, missionInfo) {
    if (!chauffeurId) return;

    await this.envoyerNotification(
      chauffeurId,
      '🗑️ Mission supprimée',
      `Mission ${missionInfo.client} annulée`,
      {
        type: 'mission_supprimee',
        mission_id: missionInfo.id.toString(),
      }
    );
  }

  // Notifier plusieurs missions envoyées
  static async notifierMissionsEnvoyees(missions) {
    const promises = missions.map(mission => this.notifierNouvelleMission(mission));
    await Promise.allSettled(promises);
  }
}

module.exports = NotificationService;
