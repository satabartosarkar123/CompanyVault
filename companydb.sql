-- PostgreSQL Database Schema for Company Verification Module
-- Database: companydb

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    gender CHAR(1) NOT NULL CHECK (gender IN ('M', 'F')),
    mobileno VARCHAR(20) NOT NULL,
    signuptype VARCHAR(20) NOT NULL CHECK (signuptype IN ('email', 'google', 'facebook')),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_mobile_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create companies table (renamed from companyprofile as per requirements)
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL CHECK (char_length(name) >= 2),
    description TEXT,
    address TEXT,
    logo_url TEXT,
    banner_url TEXT,
    website VARCHAR(255),
    industry VARCHAR(100),
    founded_year INTEGER CHECK (founded_year >= 1800 AND founded_year <= EXTRACT(YEAR FROM CURRENT_DATE)),
    employee_count INTEGER CHECK (employee_count >= 1),
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_companies_verification_status ON companies(verification_status);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON companies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
INSERT INTO users (email, password, fullname, gender, mobileno, signuptype) 
VALUES 
    ('test@example.com', '$2b$10$dummyhash', 'Test User', 'M', '1234567890', 'email'),
    ('admin@example.com', '$2b$10$dummyhash', 'Admin User', 'F', '0987654321', 'email')
ON CONFLICT (email) DO NOTHING;