const admin = require('firebase-admin');

let firebaseInitialized = false;

const initializeFirebase = () => {
  if (firebaseInitialized) {
    console.log('✅ Firebase Admin déjà initialisé');
    return admin;
  }

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || 'transport-dange'
      });
      
      firebaseInitialized = true;
      console.log('✅ Firebase Admin SDK initialisé avec succès');
      console.log('📧 Service Account:', serviceAccount.client_email);
      console.log('🆔 Project ID:', serviceAccount.project_id);
    } else {
      console.warn('⚠️ Variable FIREBASE_SERVICE_ACCOUNT non trouvée');
      console.warn('⚠️ Les notifications push ne fonctionneront pas');
    }
  } catch (error) {
    console.error('❌ Erreur initialisation Firebase:', error.message);
  }

  return admin;
};

const getMessaging = () => {
  if (!firebaseInitialized) {
    initializeFirebase();
  }
  
  return firebaseInitialized ? admin.messaging() : null;
};

module.exports = { 
  initializeFirebase,
  getMessaging
};
