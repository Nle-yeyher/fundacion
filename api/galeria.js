const { getPool } = require('./_lib/db');
const { isAuthenticated } = require('./_lib/auth');

module.exports = async function handler(req, res) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'No autorizado.' });
  const db = getPool();

  if (req.method === 'GET') {
    const [rows] = await db.query('SELECT * FROM galeria ORDER BY id DESC');
    return res.status(200).json({ items: rows });
  }

  if (req.method === 'POST') {
    const { url, nombre } = req.body || {};
    if (!url) return res.status(400).json({ error: 'Falta la URL.' });
    await db.query('INSERT INTO galeria (url, nombre) VALUES (?,?)', [url, nombre || 'imagen']);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Método no permitido.' });
};
