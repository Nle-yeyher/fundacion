const { createToken, setAuthCookie } = require('./_lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });

  try {
    const { usuario, password } = req.body || {};
   // const expectedUser = process.env.ADMIN_USER;
  // const expectedPassword = process.env.ADMIN_PASSWORD;
    const expectedUser = "jeeddadmin";
    const expectedPassword = "Choco2026!";

    if (!expectedUser || !expectedPassword) {
      return res.status(500).json({ error: 'Configura ADMIN_USER y ADMIN_PASSWORD en las variables de Vercel.' });
    }

    if (usuario !== expectedUser || password !== expectedPassword) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    setAuthCookie(res, createToken(usuario));
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
