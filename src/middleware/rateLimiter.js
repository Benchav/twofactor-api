const config = require('../config/env');
const AppError = require('../utils/AppError');

/**
 * Rate limiter en memoria por IP.
 * Para producción con múltiples instancias, considerar express-rate-limit con Redis store.
 *
 * @param {object} options
 * @param {number} options.windowMs - Ventana de tiempo en milisegundos
 * @param {number} options.max - Máximo de requests permitidos en la ventana
 * @param {string} options.message - Mensaje de error al exceder el límite
 */
function createRateLimiter(options = {}) {
  const {
    windowMs = config.rateLimitWindowMs,
    max = config.rateLimitMaxRequests,
    message = 'Demasiadas solicitudes, intente de nuevo más tarde',
  } = options;

  const clients = new Map();

  // Limpiar entradas expiradas periódicamente
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of clients) {
      if (now - record.startTime > windowMs) {
        clients.delete(key);
      }
    }
  }, windowMs);

  // Evitar que el interval mantenga vivo el proceso
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return (req, res, next) => {
    const clientKey = req.ip;
    const now = Date.now();
    const record = clients.get(clientKey);

    if (!record || now - record.startTime > windowMs) {
      // Nueva ventana
      clients.set(clientKey, { count: 1, startTime: now });
      return next();
    }

    record.count++;

    if (record.count > max) {
      return next(new AppError(message, 429));
    }

    next();
  };
}

module.exports = { createRateLimiter };
