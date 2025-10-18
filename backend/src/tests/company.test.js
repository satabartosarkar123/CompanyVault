import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../server.js';
import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

// Set test environment
process.env.NODE_ENV = 'test';

describe('Company Endpoints', () => {
  let userToken;
  let userId;

  beforeAll(async () => {
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        fullname VARCHAR(255) NOT NULL,
        gender CHAR(1) NOT NULL,
        mobileno VARCHAR(20) NOT NULL,
        signuptype VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        address TEXT,
        logo TEXT,
        owner_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Suppress console logs during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(async () => {
    // Clean up database
    await pool.query('DELETE FROM companies');
    await pool.query('DELETE FROM users');
    await pool.end();
    
    // Restore console logs
    console.log.mockRestore();
    console.error.mockRestore();
  });

  beforeEach(async () => {
    // Clean up before each test
    await pool.query('DELETE FROM companies');
    await pool.query('DELETE FROM users');
    
    // Create a test user and get JWT token
    const userResult = await pool.query(
      `INSERT INTO users (email, password, fullname, gender, mobileno, signuptype) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      ['testuser@example.com', 'hashedpassword', 'Test User', 'M', '1234567890', 'email']
    );
    
    userId = userResult.rows[0].id;
    userToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET || 'testsecret');
  });

  describe('POST /api/company/register', () => {
    it('should register a new company with valid data', async () => {
      const res = await request(app)
        .post('/api/company/register')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Test Company',
          description: 'A test company',
          address: '123 Test Street'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test Company');
      expect(res.body).toHaveProperty('description', 'A test company');
      expect(res.body).toHaveProperty('address', '123 Test Street');
      expect(res.body).toHaveProperty('owner_id', userId);
    });

    it('should reject company registration without authentication', async () => {
      const res = await request(app)
        .post('/api/company/register')
        .send({
          name: 'Test Company',
          description: 'A test company',
          address: '123 Test Street'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'No token provided');
    });

    it('should reject company registration with invalid token', async () => {
      const res = await request(app)
        .post('/api/company/register')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          name: 'Test Company',
          description: 'A test company',
          address: '123 Test Street'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid token');
    });

    it('should reject company registration with short name', async () => {
      const res = await request(app)
        .post('/api/company/register')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'A',
          description: 'A test company',
          address: '123 Test Street'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Company name must be between 2 and 200 characters'
          })
        ])
      );
    });

    it('should accept company registration with minimal data', async () => {
      const res = await request(app)
        .post('/api/company/register')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Minimal Company'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Minimal Company');
      expect(res.body).toHaveProperty('description', null);
      expect(res.body).toHaveProperty('address', null);
      expect(res.body).toHaveProperty('owner_id', userId);
    });
  });

  describe('GET /api/company/profile', () => {
    beforeEach(async () => {
      // Create a company for the test user
      await pool.query(
        `INSERT INTO companies (name, description, address, owner_id) 
         VALUES ($1, $2, $3, $4)`,
        ['Test Company', 'A test company', '123 Test Street', userId]
      );
    });

    it('should return company profile for authenticated user', async () => {
      const res = await request(app)
        .get('/api/company/profile')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Test Company');
      expect(res.body).toHaveProperty('description', 'A test company');
      expect(res.body).toHaveProperty('address', '123 Test Street');
      expect(res.body).toHaveProperty('owner_id', userId);
    });

    it('should reject profile request without authentication', async () => {
      const res = await request(app)
        .get('/api/company/profile');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'No token provided');
    });

    it('should reject profile request with invalid token', async () => {
      const res = await request(app)
        .get('/api/company/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Invalid token');
    });
  });
});