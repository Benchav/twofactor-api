/**
 * Clase de error personalizada para errores operacionales de la aplicación.
 * Permite diferenciar errores esperados (validación, auth) de errores
 * inesperados (bugs, fallos de infraestructura).
 */
class AppError extends Error {
  /**
   * @param {string} message - Mensaje de error para el cliente
   * @param {number} statusCode - Código HTTP (400, 401, 404, 500, etc.)
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
