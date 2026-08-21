const Busboy = require('busboy');
const { put } = require('@vercel/blob');
const { isAuthenticated } = require('./_lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'No autorizado.' });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(500).json({ error: 'Falta BLOB_READ_WRITE_TOKEN en Vercel.' });

  try {
    const bb = Busboy({ headers: req.headers, limits: { files: 1, fileSize: 4 * 1024 * 1024 } });
    let fileBuffer = null;
    let fileName = 'imagen';
    let mimeType = '';
    let tooLarge = false;

    const result = await new Promise((resolve, reject) => {
      const chunks = [];
      bb.on('file', (name, file, info) => {
        fileName = info.filename || 'imagen';
        mimeType = info.mimeType || '';
        file.on('data', chunk => chunks.push(chunk));
        file.on('limit', () => { tooLarge = true; });
        file.on('end', () => { fileBuffer = Buffer.concat(chunks); });
      });
      bb.on('error', reject);
      bb.on('finish', () => resolve(true));
      req.pipe(bb);
    });

    if (!result || !fileBuffer) return res.status(400).json({ error: 'Selecciona una imagen.' });
    if (tooLarge) return res.status(400).json({ error: 'La imagen no puede superar 4 MB.' });
    if (!mimeType.startsWith('image/')) return res.status(400).json({ error: 'Solo se permiten imágenes.' });

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
    const blob = await put(`fundacion/${Date.now()}-${safeName}`, fileBuffer, { access: 'public', contentType: mimeType });
    return res.status(200).json({ ok: true, url: blob.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
