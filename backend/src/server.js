const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { pool } = require('./config/database');
const { initializeFirebase } = require('./config/firebase');

const authRoutes = require('./routes/auth');
const missionRoutes = require('./routes/missions');
const chauffeurRoutes = require('./routes/chauffeurs');
const chauffeurMissionsRoutes = require('./routes/chauffeurs-missions');
const exportRoutes = require('./routes/export');
const initRoutes = require('./routes/initRoutes');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');
const geolocationRoutes = require('./routes/geolocation');
const app = express();

app.set('trust proxy', 1);

const server = http.createServer(app);
const chauffeursManageRoutes = require('./routes/chauffeurs-manage');
const debugRoutes = require('./routes/debug');
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://transport-dange-frontend.onrender.com',
    'https://transport-dange-chauffeur.onrender.com',
    'https://taxi-transportdange.onrender.com',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const io = socketIo(server, {
  cors: corsOptions,
});

app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/debug', debugRoutes);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.',
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

const gpsLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: 'Trop de mises à jour GPS, veuillez patienter.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`⚠️ Rate limit GPS atteint pour IP ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Trop de mises à jour GPS, veuillez patienter.',
      retryAfter: 300,
    });
  },
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', loginLimiter);
app.use('/api/geolocation/position', gpsLimiter);
app.use('/api/geolocation/update', gpsLimiter);
app.use('/api/', generalLimiter);

app.set('io', io);

app.use('/api/auth', authRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/chauffeurs', chauffeurRoutes);
app.use('/api/chauffeurs', chauffeurMissionsRoutes);
app.use('/api/chauffeurs/manage', chauffeursManageRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/geolocation', geolocationRoutes);
app.use('/api', initRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Transport DanGE API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
  console.error('Erreur:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erreur serveur interne',
  });
});

io.on('connection', (socket) => {
  console.log('✅ Client WebSocket connecté:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client WebSocket déconnecté:', socket.id);
  });

  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`Client ${socket.id} a rejoint la room ${room}`);
  });

  socket.on('ping', () => {
    socket.emit('pong');
    console.log('💚 Pong envoyé au client', socket.id);
  });
});

initializeFirebase();

const initializeDatabase = async () => {
  try {
    console.log('🔄 Vérification de la base de données...');
    
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'utilisateurs'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('📋 Initialisation de la base de données...');
      
      const initSqlPath = path.join(__dirname, '../database/init.sql');
      if (!fs.existsSync(initSqlPath)) {
        throw new Error('Fichier init.sql introuvable à ' + initSqlPath);
      }
      
      const initSql = fs.readFileSync(initSqlPath, 'utf8');
      
      const statements = initSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (const statement of statements) {
        try {
          await pool.query(statement);
        } catch (err) {
          console.error('Erreur SQL:', err.message);
        }
      }
      
      console.log('✅ Base de données initialisée');
    } else {
      console.log('✅ Base de données déjà initialisée');
    }
  } catch (error) {
    console.error('❌ Erreur initialisation:', error.message);
    throw error;
  }
};

const createAdminIfNotExists = async () => {
  try {
    const result = await pool.query("SELECT * FROM utilisateurs WHERE username = 'admin' AND role = 'admin'");
    if (result.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin77281670', 10);
      await pool.query(
        "INSERT INTO utilisateurs (username, password, role, created_at) VALUES ($1, $2, $3, NOW())",
        ['admin', hashedPassword, 'admin']
      );
      console.log('\n═══════════════════════════════════════════════');
      console.log('✅ Compte administrateur créé automatiquement');
      console.log('   Username: admin');
      console.log('   Password: admin77281670');
      console.log('⚠️  IMPORTANT: Changez ce mot de passe immédiatement !');
      console.log('═══════════════════════════════════════════════\n');
    } else {
      console.log('ℹ️  Compte administrateur existe déjà');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création du compte admin:', error);
  }
};

initializeDatabase()
  .then(() => createAdminIfNotExists())
  .then(() => {
    server.listen(process.env.PORT || 3000, () => {
      console.log('\n═══════════════════════════════════════════════');
      console.log('🚕 Transport DanGE - Backend API');
      console.log(`✅ Serveur démarré sur le port ${process.env.PORT || 3000}`);
      console.log('📊 Rate limiting configuré: ');
      console.log('   - Login: 10 tentatives / 15 min');
      console.log('   - GPS: 10 positions / 30 min');
      console.log('   - Général: 300 requêtes / 15 min');
      console.log('═══════════════════════════════════════════════\n');
    });
  })
  .catch((error) => {
    console.error('❌ Erreur au démarrage du serveur:', error);
    process.exit(1);
  });

const gracefulShutdown = () => {
  console.log('Arrêt du serveur en cours...');
  server.close(() => {
    console.log('Serveur arrêté.');
    pool.end(() => {
      console.log('Connexion PostgreSQL fermée.');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = { app, server, io };
