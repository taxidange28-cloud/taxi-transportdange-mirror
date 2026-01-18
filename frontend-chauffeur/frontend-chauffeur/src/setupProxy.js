const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy pour l'API backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
      onError(err, req, res) {
        console.error('Erreur de proxy API :', err);
        res.status(500).send('Le proxy API a échoué.');
      },
    })
  );
  
  // Proxy pour Socket.IO
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      ws: true,
      onError(err, req, res) {
        console.error('Erreur de proxy WebSocket :', err);
        res.status(500).send('Le proxy WebSocket a échoué.');
      },
    })
  );
};
