import pool from '../config/db.js';

export async function createUser(fields) {
  const { email, password, fullname, gender, mobileno, signuptype } = fields;
  const result = await pool.query(
    `INSERT INTO users (email, password, fullname, gender, mobileno, signuptype)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [email, password, fullname, gender, mobileno, signuptype]
  );
  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );
  return result.rows[0];
}
