import { jest } from '@jest/globals';
import app from '../server.js';
import pool from '../config/db.js';
import { performRequest } from './utils/requestHelper.js';

// Set test environment
process.env.NODE_ENV = 'test';

describe('Validation Middleware', () => {
  beforeAll(async () => {
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

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users');

    console.log.mockRestore();
    console.error.mockRestore();
  });

  beforeEach(async () => {
    await pool.query('DELETE FROM users');
  });

  describe('Registration Validation', () => {
    it('should reject invalid email', async () => {
      const res = await performRequest(app, {
        method: 'POST',
        path: '/api/auth/register',
        body: {
          email: 'invalid-email',
          password: '12345678',
          fullname: 'Test User',
          gender: 'M',
          mobileno: '12345678',
          signuptype: 'email',
        },
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Valid email required',
          }),
        ]),
      );
    });

    it('should reject short password', async () => {
      const res = await performRequest(app, {
        method: 'POST',
        path: '/api/auth/register',
        body: {
          email: 'test@example.com',
          password: '123',
          fullname: 'Test User',
          gender: 'M',
          mobileno: '12345678',
          signuptype: 'email',
        },
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Password must be at least 8 characters',
          }),
        ]),
      );
    });

    it('should reject invalid gender', async () => {
      const res = await performRequest(app, {
        method: 'POST',
        path: '/api/auth/register',
        body: {
          email: 'test@example.com',
          password: '12345678',
          fullname: 'Test User',
          gender: 'X',
          mobileno: '12345678',
          signuptype: 'email',
        },
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Gender must be M or F',
          }),
        ]),
      );
    });

    it('should reject short mobile number', async () => {
      const res = await performRequest(app, {
        method: 'POST',
        path: '/api/auth/register',
        body: {
          email: 'test@example.com',
          password: '12345678',
          fullname: 'Test User',
          gender: 'M',
          mobileno: '123',
          signuptype: 'email',
        },
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Mobile number must be between 8 and 15 digits',
          }),
        ]),
      );
    });

    it('should reject invalid signup type', async () => {
      const res = await performRequest(app, {
        method: 'POST',
        path: '/api/auth/register',
        body: {
          email: 'test@example.com',
          password: '12345678',
          fullname: 'Test User',
          gender: 'M',
          mobileno: '12345678',
          signuptype: 'invalid',
        },
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Signup type must be email, google, or facebook',
          }),
        ]),
      );
    });
  });

  describe('Login Validation', () => {
    it('should reject invalid email format', async () => {
      const res = await performRequest(app, {
        method: 'POST',
        path: '/api/auth/login',
        body: {
          email: 'invalid-email',
          password: 'password123',
        },
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Valid email required',
          }),
        ]),
      );
    });

    it('should reject empty password', async () => {
      const res = await performRequest(app, {
        method: 'POST',
        path: '/api/auth/login',
        body: {
          email: 'test@example.com',
          password: '',
        },
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Password is required',
          }),
        ]),
      );
    });
  });
});
