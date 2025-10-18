// This file runs before Jest loads any tests
import { jest } from '@jest/globals';
import dotenv from 'dotenv';

// Load test environment variables
process.env.NODE_ENV = 'test';
dotenv.config({ path: '.env.test' });
