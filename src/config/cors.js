const config = require('./env');

const corsOptions = {
  origin: config.isDevelopment
    ? true // Permite cualquier origen en desarrollo
    : config.corsOrigin.split(',').map((o) => o.trim()),
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 horas de cache para preflight
};

module.exports = corsOptions;
