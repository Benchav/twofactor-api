const { Router } = require('express');
const authRoutes = require('./auth.routes');

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Montar rutas de autenticación bajo /auth
router.use('/auth', authRoutes);

module.exports = router;
