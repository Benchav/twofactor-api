const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Almacenamiento temporal de códigos en memoria (para fines de desarrollo local)
// Formato: { "user@example.com": { code: "123456", expiresAt: timestamp } }
const verificationCodes = {};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  // Aquí iría la validación real contra una base de datos.
  // Para la demo, simulamos que el login inicial es exitoso y pasamos al 2FA.
  
  // Generar un código de 6 dígitos
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Expiración: 5 minutos
  const expiresAt = Date.now() + 5 * 60 * 1000;
  verificationCodes[email] = { code, expiresAt };

  try {
    const { data, error } = await resend.emails.send({
      from: 'Agro Control <onboarding@resend.dev>', // Usando el remitente sandbox por defecto de Resend
      to: [email],
      subject: 'Tu código de verificación de Agro Control',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Código de Verificación</h2>
          <p>Has solicitado iniciar sesión en Agro Control.</p>
          <p>Tu código de autenticación de dos factores es:</p>
          <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          <p>Este código expirará en 5 minutos.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error enviando email:', error);
      return res.status(500).json({ error: 'No se pudo enviar el correo de verificación' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Código de verificación enviado al correo' 
    });
  } catch (error) {
    console.error('Excepción enviando email:', error);
    res.status(500).json({ error: 'Error del servidor al intentar enviar el correo' });
  }
};

exports.verify2FA = (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email y código son requeridos' });
  }

  const record = verificationCodes[email];

  if (!record) {
    return res.status(400).json({ error: 'No hay un código pendiente para este correo' });
  }

  if (Date.now() > record.expiresAt) {
    delete verificationCodes[email];
    return res.status(400).json({ error: 'El código ha expirado' });
  }

  if (record.code !== code) {
    return res.status(400).json({ error: 'Código incorrecto' });
  }

  // Código correcto: eliminar el registro y retornar éxito
  delete verificationCodes[email];

  // En un sistema real aquí se generaría un JWT. 
  // Para la demo devolvemos los datos del usuario.
  res.status(200).json({
    success: true,
    user: {
      email,
      name: 'Usuario Autenticado',
      org: 'Organización Demo'
    },
    token: 'mock-jwt-token-123456789'
  });
};
