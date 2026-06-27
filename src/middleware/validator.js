const AppError = require('../utils/AppError');

/**
 * Valida el body del request de login.
 * Requiere: email (formato válido), password (no vacío).
 */
function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email y contraseña son requeridos', 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Formato de email inválido', 400));
  }

  if (typeof password !== 'string' || password.length < 1) {
    return next(new AppError('La contraseña no puede estar vacía', 400));
  }

  next();
}

/**
 * Valida el body del request de verificación 2FA.
 * Requiere: email (formato válido), code (6 dígitos numéricos).
 */
function validateVerify2FA(req, res, next) {
  const { email, code } = req.body;

  if (!email || !code) {
    return next(new AppError('Email y código son requeridos', 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Formato de email inválido', 400));
  }

  if (typeof code !== 'string' || !/^\d{6}$/.test(code)) {
    return next(new AppError('El código debe ser de 6 dígitos numéricos', 400));
  }

  next();
}

module.exports = { validateLogin, validateVerify2FA };
