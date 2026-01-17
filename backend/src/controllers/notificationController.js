const { getMessaging } = require('../config/firebase');
const { pool } = require('../config/database');

exports.sendNotificationToDriver = async (req, res) => {
  try {
    const { driverId, title, body, data } = req.body;

    console.log('📤 Envoi notification au chauffeur:', driverId);

    // CORRECTION : Requête sur la table CHAUFFEURS
    const result = await pool.query(
      'SELECT id, nom, username, fcm_token FROM chauffeurs WHERE id = $1 AND actif = TRUE',
      [driverId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Chauffeur non trouvé' 
      });
    }

    const driver = result.rows[0];

    if (!driver.fcm_token) {
      return res.status(400).json({ 
        success: false,
        message: 'Token FCM manquant pour ce chauffeur' 
      });
    }

    const message = {
      token: driver.fcm_token,
      notification: {
        title: title || '🚖 Nouvelle Mission',
        body: body || 'Une nouvelle mission vous attend'
      },
      data: {
        ...data,
        click_action: '/missions'
      },
      webpush: {
        headers: {
          Urgency: 'high',
          TTL: '0'
        },
        notification: {
          requireInteraction: true,
          vibrate: [1000, 500, 1000],
          icon: '/logo192.png',
          badge: '/logo192.png',
          tag: 'mission-' + Date.now()
        },
        fcmOptions: {
          link: '/missions'
        }
      }
    };

    const messaging = getMessaging();
    
    if (!messaging) {
      return res.status(500).json({
        success: false,
        message: 'Firebase Messaging non initialisé'
      });
    }

    const response = await messaging.send(message);
    
    console.log('✅ Notification envoyée avec succès:', response);
    
    res.status(200).json({ 
      success: true, 
      message: 'Notification envoyée avec succès',
      messageId: response
    });
  } catch (error) {
    console.error('❌ Erreur envoi notification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'envoi de la notification',
      error: error.message 
    });
  }
};

exports.sendNotificationToAllDrivers = async (req, res) => {
  try {
    const { title, body, data } = req.body;

    console.log('📤 Envoi notification à tous les chauffeurs');

    // CORRECTION : Requête sur la table CHAUFFEURS
    const result = await pool.query(
      'SELECT id, nom, username, fcm_token FROM chauffeurs WHERE actif = TRUE AND fcm_token IS NOT NULL'
    );

    console.log(`✅ ${result.rows.length} chauffeurs actifs trouvés avec token FCM`);

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Aucun chauffeur avec token FCM trouvé',
        successCount: 0,
        failureCount: 0
      });
    }

    const tokens = result.rows.map(driver => driver.fcm_token).filter(t => t);

    if (tokens.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Aucun token FCM valide trouvé',
        successCount: 0,
        failureCount: 0
      });
    }

    console.log(`📲 Envoi vers ${tokens.length} token(s)`);

    const message = {
      notification: {
        title: title || '🚖 Transport DanGE',
        body: body || 'Nouvelle notification'
      },
      data: {
        ...data,
        click_action: '/missions'
      },
      tokens: tokens
    };

    const messaging = getMessaging();
    
    if (!messaging) {
      return res.status(500).json({
        success: false,
        message: 'Firebase Messaging non initialisé'
      });
    }

    const response = await messaging.sendEachForMulticast(message);
    
    console.log(`✅ Notifications envoyées: ${response.successCount}/${tokens.length}`);
    
    if (response.failureCount > 0) {
      console.warn(`⚠️ ${response.failureCount} notifications ont échoué`);
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`❌ Token ${idx} error:`, resp.error);
        }
      });
    }
    
    res.status(200).json({
      success: true,
      message: `${response.successCount} notifications envoyées sur ${tokens.length}`,
      successCount: response.successCount,
      failureCount: response.failureCount
    });
  } catch (error) {
    console.error('❌ Erreur envoi notifications:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi des notifications',
      error: error.message
    });
  }
};

module.exports = exports;
