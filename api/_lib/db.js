const mysql = require('mysql2/promise');

let pool;

function getPool() {
  if (!pool) {
    const host = process.env.TIDB_HOST;
    const user = process.env.TIDB_USER;
    const password = process.env.TIDB_PASSWORD;
    const database = process.env.TIDB_DATABASE;
    const port = Number(process.env.TIDB_PORT || 4000);

    if (!host || !user || !password || !database) {
      throw new Error('Faltan variables TIDB_HOST, TIDB_USER, TIDB_PASSWORD o TIDB_DATABASE en Vercel.');
    }

    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 4,
      queueLimit: 0,
      ssl: { rejectUnauthorized: true },
      charset: 'utf8mb4'
    });
  }
  return pool;
}

module.exports = { getPool };
