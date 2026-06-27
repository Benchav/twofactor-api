const config = require('../config/env');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * Almacenamiento temporal de códigos de verificación en memoria.
 * Formato: { "email": { code, expiresAt } }
 *
 * Para producción, reemplazar por Redis o base de datos.
 */
const verificationCodes = new Map();

/**
 * Limpieza automática de códigos expirados cada minuto.
 */
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [email, record] of verificationCodes) {
    if (now > record.expiresAt) {
      verificationCodes.delete(email);
      logger.debug('AuthService', `Código expirado eliminado para ${email}`);
    }
  }
}, 60 * 1000);

if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

/**
 * Genera un código numérico aleatorio de N dígitos.
 * @returns {string}
 */
function generateCode() {
  const min = Math.pow(10, config.codeLength - 1);
  const max = Math.pow(10, config.codeLength) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

/**
 * Genera y almacena un código de verificación para el email dado.
 * @param {string} email
 * @returns {string} El código generado
 */
function createVerificationCode(email) {
  const code = generateCode();
  const expiresAt = Date.now() + config.codeExpirationMinutes * 60 * 1000;

  verificationCodes.set(email, { code, expiresAt });
  logger.info('AuthService', `Código de verificación generado para ${email}`);

  return code;
}

/**
 * Verifica el código 2FA proporcionado.
 * @param {string} email
 * @param {string} code
 * @returns {object} Datos del usuario autenticado
 * @throws {AppError} Si el código es inválido, expirado o inexistente
 */
function verifyCode(email, code) {
  const record = verificationCodes.get(email);

  if (!record) {
    throw new AppError('No hay un código pendiente para este correo', 400);
  }

  if (Date.now() > record.expiresAt) {
    verificationCodes.delete(email);
    throw new AppError('El código ha expirado', 400);
  }

  if (record.code !== code) {
    throw new AppError('Código incorrecto', 400);
  }

  // Código correcto — eliminar del store
  verificationCodes.delete(email);
  logger.info('AuthService', `Verificación 2FA exitosa para ${email}`);

  // En un sistema real aquí se generaría un JWT.
  // Para la demo devolvemos los datos del usuario.
  return {
    user: {
      email,
      name: 'Usuario Autenticado',
      org: 'Organización Demo',
    },
    token: 'mock-jwt-token-123456789',
  };
}

module.exports = { createVerificationCode, verifyCode };
