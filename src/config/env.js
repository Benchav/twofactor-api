require('dotenv').config();

const config = Object.freeze({
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  resendApiKey: process.env.RESEND_API_KEY,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // 2FA settings
  codeLength: 6,
  codeExpirationMinutes: 5,

  // Rate limiting
  rateLimitWindowMs: 60 * 1000, // 1 minuto
  rateLimitMaxRequests: 10,

  get isDevelopment() {
    return this.nodeEnv === 'development';
  },

  get isProduction() {
    return this.nodeEnv === 'production';
  },
});

// Validar variables críticas al iniciar
const requiredVars = ['RESEND_API_KEY'];
for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.error(`[CONFIG] Variable de entorno requerida no encontrada: ${varName}`);
    if (config.isProduction) {
      process.exit(1);
    }
  }
}

module.exports = config;
