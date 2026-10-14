import pg from 'pg';
import { config } from '../config/environment.js';

const { Pool } = pg;

export const pool = new Pool(
  config.db.url
    ? { connectionString: config.db.url }
    : {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name
      }
);

export const query = (text, params) => pool.query(text, params);

export default pool;
