const { getPool } = require('./_lib/db');
const { isAuthenticated } = require('./_lib/auth');

module.exports = async function handler(req, res) {
  try {
    const db = getPool();

    if (req.method === 'GET') {
      const modoAdmin = req.query?.admin === '1';
      if (modoAdmin && !isAuthenticated(req)) return res.status(401).json({ error: 'No autorizado.' });
      const [rows] = await db.query(modoAdmin
        ? 'SELECT clave, valor, tipo, etiqueta, grupo FROM contenido WHERE activo = 1 ORDER BY grupo, id'
        : 'SELECT clave, valor FROM contenido WHERE activo = 1 ORDER BY id');
      if (modoAdmin) return res.status(200).json({ items: rows });
      const contenido = {};
      for (const row of rows) contenido[row.clave] = row.valor;
      return res.status(200).json(contenido);
    }

    if (!isAuthenticated(req)) return res.status(401).json({ error: 'No autorizado.' });

    if (req.method === 'PUT') {
      const items = Array.isArray(req.body?.items) ? req.body.items : [];
      if (!items.length) return res.status(400).json({ error: 'No hay cambios para guardar.' });

      for (const item of items) {
        if (!item.clave || typeof item.valor !== 'string') continue;
        await db.query(
          `INSERT INTO contenido (clave, valor, tipo, etiqueta, grupo, activo)
           VALUES (?, ?, COALESCE(?, 'texto'), COALESCE(?, ?), COALESCE(?, 'General'), 1)
           ON DUPLICATE KEY UPDATE valor = VALUES(valor), tipo = VALUES(tipo), etiqueta = VALUES(etiqueta), grupo = VALUES(grupo), activo = 1`,
          [item.clave, item.valor, item.tipo || 'texto', item.etiqueta || item.clave, item.grupo || 'General']
        );
      }
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const clave = req.body?.clave;
      if (!clave) return res.status(400).json({ error: 'Falta la clave.' });
      await db.query("UPDATE contenido SET valor = '' WHERE clave = ?", [clave]);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
