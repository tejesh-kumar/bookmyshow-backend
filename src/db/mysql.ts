import mysql, { PoolOptions } from 'mysql2/promise';

const access: PoolOptions = {
  host: process.env.DB_HOST || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  timezone: 'Z',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const db = mysql.createPool(access);
(async () => await db.query("SET time_zone = '+00:00'"))();

export default db;
