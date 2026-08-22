const { getPool } = require('./_lib/db');
const { isAuthenticated } = require('./_lib/auth');

module.exports = async function handler(req, res) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'No autorizado.' });
  const db = getPool();

  // GET lista
  if (req.method === 'GET') {
    const [rows] = await db.query('SELECT * FROM publicaciones ORDER BY fecha DESC, id DESC');
    return res.status(200).json({ items: rows });
  }

  // POST crear
  if (req.method === 'POST') {
    const { titulo, extracto, contenido, estado, categoria, fecha, imagen } = req.body || {};
    if (!titulo) return res.status(400).json({ error: 'El título es obligatorio.' });
    const [r] = await db.query(
      'INSERT INTO publicaciones (titulo, extracto, contenido, estado, categoria, fecha, imagen) VALUES (?,?,?,?,?,?,?)',
      [titulo, extracto || '', contenido || '', estado || 'borrador', categoria || 'general', fecha || new Date().toISOString().split('T')[0], imagen || '']
    );
    return res.status(200).json({ ok: true, id: r.insertId });
  }

  return res.status(405).json({ error: 'Método no permitido.' });
};
