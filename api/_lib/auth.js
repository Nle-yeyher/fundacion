const jwt = require('jsonwebtoken');

function cookieValue(cookieHeader, name) {
  if (!cookieHeader) return null;
  const match = cookieHeader.split(';').map(v => v.trim()).find(v => v.startsWith(name + '='));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function secret() {
  if (!process.env.ADMIN_JWT_SECRET) throw new Error('Falta ADMIN_JWT_SECRET en Vercel.');
  return process.env.ADMIN_JWT_SECRET;
}

function isAuthenticated(req) {
  const token = cookieValue(req.headers.cookie, 'admin_token');
  if (!token) return false;
  try {
    jwt.verify(token, secret());
    return true;
  } catch {
    return false;
  }
}

function createToken(username) {
  return jwt.sign({ sub: username, role: 'admin' }, secret(), { expiresIn: '7d' });
}

function setAuthCookie(res, token) {
  res.setHeader('Set-Cookie', `admin_token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
}

function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', 'admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
}

module.exports = { isAuthenticated, createToken, setAuthCookie, clearAuthCookie };
