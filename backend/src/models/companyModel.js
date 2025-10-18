import pool from '../config/db.js';

export async function createCompany(fields) {
  const { name, description, address, logo_url, banner_url, owner_id } = fields;
  const result = await pool.query(
    `INSERT INTO companies (name, description, address, logo_url, banner_url, owner_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, description, address, logo_url, banner_url, owner_id]
  );
  return result.rows[0];
}

export async function getCompany(ownerId) {
  const result = await pool.query(
    `SELECT * FROM companies WHERE owner_id = $1`,
    [ownerId]
  );
  return result.rows[0];
}

export async function updateCompany(ownerId, fields) {
  const { name, description, address, logo_url, banner_url } = fields;
  const result = await pool.query(
    `UPDATE companies 
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         address = COALESCE($3, address),
         logo_url = COALESCE($4, logo_url),
         banner_url = COALESCE($5, banner_url),
         updated_at = CURRENT_TIMESTAMP
     WHERE owner_id = $6
     RETURNING *`,
    [name, description, address, logo_url, banner_url, ownerId]
  );
  return result.rows[0];
}
