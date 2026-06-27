const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { validateLogin, validateVerify2FA } = require('../middleware/validator');
const { createRateLimiter } = require('../middleware/rateLimiter');

const router = Router();

// Rate limiter específico para auth: 5 intentos por minuto por IP
const authLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de autenticación, intente en 1 minuto',
});

router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/verify-2fa', authLimiter, validateVerify2FA, authController.verify2FA);

module.exports = router;
