const AppError = require('../utils/AppError');

/**
 * Valida el body del request de login.
 * Requiere: email (formato válido), password (no vacío).
 */
function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de email inválido' });
  }

  if (typeof password !== 'string' || password.length < 1) {
    return res.status(400).json({ error: 'La contraseña no puede estar vacía' });
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
    return res.status(400).json({ error: 'Email y código son requeridos' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de email inválido' });
  }

  if (typeof code !== 'string' || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: 'El código debe ser de 6 dígitos numéricos' });
  }

  next();
}

/**
 * Valida el body del request de registro.
 * Requiere: name, org, email, password.
 */
function validateRegister(req, res, next) {
  const { name, org, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de email inválido' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  next();
}

module.exports = { validateLogin, validateVerify2FA, validateRegister };
