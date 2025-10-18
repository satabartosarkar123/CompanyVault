import { jest } from '@jest/globals';
import app from '../server.js';
import pool from '../config/db.js';
import { performRequest } from './utils/requestHelper.js';

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
        logo_url TEXT,
        banner_url TEXT,
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
    const res = await performRequest(app, {
      method: 'POST',
      path: '/api/auth/register',
      body: {
        email: 'test@mail.com',
        password: '12345678',
        fullname: 'Test',
        gender: 'M',
        mobileno: '12345678',
        signuptype: 'email',
      },
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toMatchObject({
      email: 'test@mail.com',
      fullname: 'Test',
      gender: 'M',
      mobileno: '12345678',
      signuptype: 'email',
    });
    expect(res.body).toHaveProperty('company', null);
  });

  it('should prevent duplicate email registration', async () => {
    await performRequest(app, {
      method: 'POST',
      path: '/api/auth/register',
      body: {
        email: "test@mail.com",
        password: "12345678",
        fullname: "Test",
        gender: "M",
        mobileno: "12345678",
        signuptype: "email"
      },
    });

    const res = await performRequest(app, {
      method: 'POST',
      path: '/api/auth/register',
      body: {
        email: "test@mail.com",
        password: "different",
        fullname: "Test2",
        gender: "F",
        mobileno: "87654321",
        signuptype: "email"
      },
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error', 'Email already exists');
  });

  it('should fail on wrong login', async () => {
    const res = await performRequest(app, {
      method: 'POST',
      path: '/api/auth/login',
      body: {
        email: "notfound@mail.com",
        password: "wrong"
      },
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });
});
