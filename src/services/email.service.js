const { Resend } = require('resend');
const config = require('../config/env');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const resend = new Resend(config.resendApiKey);

/**
 * Genera el HTML del correo de verificación.
 * @param {string} code - Código de 6 dígitos
 * @returns {string} HTML del email
 */
function buildVerificationEmailHtml(code) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Código de Verificación</h2>
      <p>Has solicitado iniciar sesión en Agro Control.</p>
      <p>Tu código de autenticación de dos factores es:</p>
      <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${code}</h1>
      <p>Este código expirará en ${config.codeExpirationMinutes} minutos.</p>
    </div>
  `;
}

/**
 * Envía el correo con el código de verificación.
 * @param {string} email - Dirección de destino
 * @param {string} code - Código de verificación
 * @throws {AppError} Si el envío falla
 */
async function sendVerificationCode(email, code) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Agro Control <no-reply@nicapages.site>',
      to: [email],
      subject: 'Tu código de verificación de Agro Control',
      html: buildVerificationEmailHtml(code),
    });

    if (error) {
      logger.error('EmailService', 'Error de Resend al enviar email', {
        email,
        error,
      });
      throw new AppError('No se pudo enviar el correo de verificación', 500);
    }

    logger.info('EmailService', `Correo de verificación enviado a ${email}`, {
      id: data?.id,
    });
  } catch (err) {
    // Si ya es un AppError, re-lanzar
    if (err.isOperational) {
      throw err;
    }

    logger.error('EmailService', 'Excepción al enviar email', {
      email,
      message: err.message,
    });
    throw new AppError('Error del servidor al intentar enviar el correo', 500);
  }
}

module.exports = { sendVerificationCode };
