const { getPool } = require('../_lib/db');
const { isAuthenticated } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'No autorizado.' });
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Método no permitido.' });
  const db = getPool();
  await db.query('DELETE FROM galeria WHERE id=?', [req.query.id]);
  return res.status(200).json({ ok: true });
};
