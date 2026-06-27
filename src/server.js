const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authController = require('./controllers/authController');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/login', authController.login);
app.post('/api/auth/verify-2fa', authController.verify2FA);

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`TwoFactor API running on http://localhost:${PORT}`);
  });
}

// Exportamos la app para que Vercel la pueda consumir como Serverless Function
module.exports = app;
