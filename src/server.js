const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const corsOptions = require('./config/cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// ─── App Setup ───────────────────────────────────────────
const app = express();

// ─── Global Middleware ───────────────────────────────────
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));

// ─── Routes ──────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'TwoFactor API is running' });
});
app.use('/api', routes);

// ─── 404 Handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ─── Global Error Handler ────────────────────────────────
app.use(errorHandler);

// ─── Start Server (solo en desarrollo) ───────────────────
if (!config.isProduction) {
  app.listen(config.port, () => {
    logger.info('Server', `TwoFactor API running on http://localhost:${config.port}`);
    logger.info('Server', `Environment: ${config.nodeEnv}`);
  });
}

// Exportamos la app para que Vercel la pueda consumir como Serverless Function
module.exports = app;
