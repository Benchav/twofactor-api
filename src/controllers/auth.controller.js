const authService = require('../services/auth.service');
const emailService = require('../services/email.service');

/**
 * POST /api/auth/login
 * Recibe email y password, genera código 2FA y lo envía por correo.
 *
 * Response: { success: true, message: "..." }
 */
exports.login = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Aquí iría la validación real contra una base de datos.
    // Para la demo, simulamos que el login inicial es exitoso y pasamos al 2FA.

    const code = authService.createVerificationCode(email);
    await emailService.sendVerificationCode(email, code);

    res.status(200).json({
      success: true,
      message: 'Código de verificación enviado al correo',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/verify-2fa
 * Verifica el código 2FA y retorna datos del usuario.
 *
 * Response: { success: true, user: {...}, token: "..." }
 */
exports.verify2FA = (req, res, next) => {
  try {
    const { email, code } = req.body;
    const result = authService.verifyCode(email, code);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
