const { getPool } = require('../_lib/db');
const { isAuthenticated } = require('../_lib/auth');

module.exports = async function handler(req, res) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'No autorizado.' });
  const db = getPool();
  const id = req.query.id;

  if (req.method === 'PUT') {
    const { titulo, extracto, contenido, estado, categoria, fecha, imagen } = req.body || {};
    await db.query(
      'UPDATE publicaciones SET titulo=?, extracto=?, contenido=?, estado=?, categoria=?, fecha=?, imagen=? WHERE id=?',
      [titulo, extracto||'', contenido||'', estado||'borrador', categoria||'general', fecha, imagen||'', id]
    );
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    await db.query('DELETE FROM publicaciones WHERE id=?', [id]);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Método no permitido.' });
};
