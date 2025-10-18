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
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

export default pool;
