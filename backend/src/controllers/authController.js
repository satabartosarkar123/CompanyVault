import bcrypt from 'bcrypt';
import jwt from '../utils/jwt.js';
import { findUserByEmail, createUser } from '../models/userModel.js';
import sanitizeHtml from 'sanitize-html';

/**
 * Register a new user account
 * 
 * @route POST /api/auth/register
 * @access Public
 * 
 * @body {
 *   email: string (required) - Valid email address
 *   password: string (required) - Minimum 8 characters
 *   fullname: string (required) - User's full name (2-100 characters)
 *   gender: string (required) - 'M' or 'F'
 *   mobileno: string (required) - Mobile number (8-15 digits)
 *   signuptype: string (required) - 'email', 'google', or 'facebook'
 * }
 * 
 * @returns {
 *   201: { message: string, userId: number }
 *   400: { error: 'Validation failed', details: ValidationError[] }
 *   409: { error: 'Email already exists' }
 *   500: { error: 'Internal server error' }
 * }
 */
export async function register(req, res, next) {
  try {
    const { email, password, gender, mobileno, signuptype } = req.body;
    const fullname = sanitizeHtml(req.body.fullname);

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password and create user
    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser({ 
      email, 
      password: hashed, 
      fullname, 
      gender, 
      mobileno, 
      signuptype 
    });

    // Send success response
    res.status(201).json({ 
      message: 'Registered! Please verify email & mobile.', 
      userId: user.id 
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Authenticate user and return JWT token
 * 
 * @route POST /api/auth/login
 * @access Public
 * 
 * @body {
 *   email: string (required) - Valid email address
 *   password: string (required) - User password
 * }
 * 
 * @returns {
 *   200: { token: string, userId: number }
 *   400: { error: 'Validation failed', details: ValidationError[] }
 *   401: { error: 'Invalid credentials' }
 *   500: { error: 'Internal server error' }
 * }
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '90d' }
    );

    // Send success response
    res.json({ token, userId: user.id });
  } catch (err) {
    next(err);
  }
}
