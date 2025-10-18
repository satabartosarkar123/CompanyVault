import pkg from 'pg';
import { createRequire } from 'module';
import dotenv from 'dotenv';

const { Pool } = pkg;
let pool;

if (process.env.NODE_ENV !== 'test') {
  dotenv.config({ path: process.env.DOTENV_PATH || '.env' });
}

if (process.env.NODE_ENV === 'test') {
  const require = createRequire(import.meta.url);
  const { newDb } = require('pg-mem');
  const mem = newDb({
    autoCreateForeignKeyIndices: true,
  });
  const adapter = mem.adapters.createPg();
  pool = new adapter.Pool();
} else {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined.');
  }

  const isLocalConnection = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);

  const connectionConfig = {
    connectionString: process.env.DATABASE_URL,
  };

  if (!isLocalConnection) {
    connectionConfig.ssl = { rejectUnauthorized: false };
  }

  pool = new Pool(connectionConfig);
}

export default pool;
