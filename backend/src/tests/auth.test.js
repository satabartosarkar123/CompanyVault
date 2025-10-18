import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../server.js';
import pool from '../config/db.js';

// Set test environment
process.env.NODE_ENV = 'test';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Create users table if it doesn't exist
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
    
    // Create companies table if it doesn't exist
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
  });

  it('should register new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: "test@mail.com",
        password: "12345678",
        fullname: "Test",
        gender: "M",
        mobileno: "12345678",
        signuptype: "email"
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('message', 'Registered! Please verify email & mobile.');
  });

  it('should prevent duplicate email registration', async () => {
    // Register first user
    await request(app)
      .post('/api/auth/register')
      .send({
        email: "test@mail.com",
        password: "12345678",
        fullname: "Test",
        gender: "M",
        mobileno: "12345678",
        signuptype: "email"
      });

    // Try to register with same email
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: "test@mail.com",
        password: "different",
        fullname: "Test2",
        gender: "F",
        mobileno: "87654321",
        signuptype: "email"
      });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error', 'Email already exists');
  });

  it('should fail on wrong login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "notfound@mail.com",
        password: "wrong"
      });
      
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });
});