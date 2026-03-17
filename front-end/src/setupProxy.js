// For development, you can add this to your package.json proxy configuration
// This will proxy API requests from React (localhost:3000) to Laravel (localhost:8000)

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  );
};
