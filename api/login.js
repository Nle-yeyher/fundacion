const mysql = require('mysql2/promise');
const { createToken, setAuthCookie } = require('./_lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });

  let connection;
  try {
    const { usuario, password } = req.body || {};

    if (!usuario || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' });
    }

    // Conexión directa usando tus variables existentes de TiDB Cloud
    connection = await mysql.createConnection({
      host: process.env.TIDB_HOST,
      port: process.env.TIDB_PORT || 4000,
      user: process.env.TIDB_USER,
      password: process.env.TIDB_PASSWORD,
      database: process.env.TIDB_DATABASE || 'fundacion',
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
    });

    // Buscar el usuario en la nueva tabla de TiDB Cloud
    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE usuario = ? AND password = ? AND activo = 1',
      [usuario, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    // Credenciales correctas -> Generar sesión
    setAuthCookie(res, createToken(usuario));
    return res.status(200).json({ ok: true });

  } catch (error) {
    return res.status(500).json({ error: 'Error de base de datos: ' + error.message });
  } finally {
    if (connection) await connection.end();
  }
};
