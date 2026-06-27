const logger = require('../utils/logger');

/**
 * Middleware global de manejo de errores.
 * Debe registrarse DESPUÉS de todas las rutas.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Valores por defecto
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  // Loggear el error
  if (isOperational) {
    logger.warn('ErrorHandler', err.message, {
      statusCode,
      path: req.originalUrl,
    });
  } else {
    logger.error('ErrorHandler', 'Error inesperado', {
      message: err.message,
      stack: err.stack,
      path: req.originalUrl,
    });
  }

  // Respuesta al cliente — nunca exponer stack traces en producción
  res.status(statusCode).json({
    error: isOperational ? err.message : 'Error interno del servidor',
  });
}

module.exports = errorHandler;
