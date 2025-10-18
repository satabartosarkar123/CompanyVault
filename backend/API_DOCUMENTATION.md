# Company Verification API Documentation

## Overview
This API provides user authentication and company profile management functionality with comprehensive validation, sanitization, and security features.

**Base URL:** `http://localhost:5000`

## Authentication
Most endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Auth Endpoints

### 1. Register User

**Route:** `POST /api/auth/register`  
**Access:** Public  
**Description:** Register a new user account

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "fullname": "John Doe",
  "gender": "M",
  "mobileno": "1234567890",
  "signuptype": "email"
}
```

#### Field Validation
- `email`: Valid email format, normalized
- `password`: Minimum 8 characters
- `fullname`: 2-100 characters, letters and spaces only
- `gender`: Must be "M" or "F"
- `mobileno`: 8-15 digits
- `signuptype`: Must be "email", "google", or "facebook"

#### Response Examples

**Success (201)**
```json
{
  "message": "Registered! Please verify email & mobile.",
  "userId": 123
}
```

**Validation Error (400)**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "type": "field",
      "msg": "Valid email required",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Duplicate Email (409)**
```json
{
  "error": "Email already exists"
}
```

**Server Error (500)**
```json
{
  "error": "Internal server error"
}
```

---

### 2. Login User

**Route:** `POST /api/auth/login`  
**Access:** Public  
**Description:** Authenticate user and return JWT token

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Field Validation
- `email`: Valid email format, normalized
- `password`: Required, non-empty

#### Response Examples

**Success (200)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 123
}
```

**Validation Error (400)**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "type": "field",
      "msg": "Password is required",
      "path": "password",
      "location": "body"
    }
  ]
}
```

**Invalid Credentials (401)**
```json
{
  "error": "Invalid credentials"
}
```

**Server Error (500)**
```json
{
  "error": "Internal server error"
}
```

---

## Company Endpoints

### 3. Register Company

**Route:** `POST /api/company/register`  
**Access:** Private (JWT required)  
**Description:** Register a new company profile with optional logo upload

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data (if uploading logo)
Content-Type: application/json (if no logo)
```

#### Request Body (Form Data)
```
name: "Acme Corporation"
description: "Leading provider of innovative solutions"
address: "123 Business Street, City, State"
logo: [File] (optional)
```

#### Request Body (JSON - no logo)
```json
{
  "name": "Acme Corporation",
  "description": "Leading provider of innovative solutions",
  "address": "123 Business Street, City, State"
}
```

#### Field Validation
- `name`: Required, 2-200 characters
- `description`: Optional, max 1000 characters
- `address`: Optional, max 500 characters
- `logo`: Optional image file

#### Response Examples

**Success (201)**
```json
{
  "id": 456,
  "name": "Acme Corporation",
  "description": "Leading provider of innovative solutions",
  "address": "123 Business Street, City, State",
  "logo": "https://res.cloudinary.com/demo/image/upload/v1234567890/logo.jpg",
  "owner_id": 123,
  "created_at": "2024-01-17T10:30:00.000Z",
  "updated_at": "2024-01-17T10:30:00.000Z"
}
```

**Success with Minimal Data (201)**
```json
{
  "id": 456,
  "name": "Minimal Company",
  "description": null,
  "address": null,
  "logo": null,
  "owner_id": 123,
  "created_at": "2024-01-17T10:30:00.000Z",
  "updated_at": "2024-01-17T10:30:00.000Z"
}
```

**Validation Error (400)**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "type": "field",
      "msg": "Company name must be between 2 and 200 characters",
      "path": "name",
      "location": "body"
    }
  ]
}
```

**Authentication Error (401)**
```json
{
  "error": "No token provided"
}
```

**Invalid Token (401)**
```json
{
  "error": "Invalid token"
}
```

**Server Error (500)**
```json
{
  "error": "Internal server error"
}
```

---

### 4. Get Company Profile

**Route:** `GET /api/company/profile`  
**Access:** Private (JWT required)  
**Description:** Get company profile for authenticated user

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Response Examples

**Success (200)**
```json
{
  "id": 456,
  "name": "Acme Corporation",
  "description": "Leading provider of innovative solutions",
  "address": "123 Business Street, City, State",
  "logo": "https://res.cloudinary.com/demo/image/upload/v1234567890/logo.jpg",
  "owner_id": 123,
  "created_at": "2024-01-17T10:30:00.000Z",
  "updated_at": "2024-01-17T10:30:00.000Z"
}
```

**Authentication Error (401)**
```json
{
  "error": "No token provided"
}
```

**Invalid Token (401)**
```json
{
  "error": "Invalid token"
}
```

**Company Not Found (404)**
```json
{
  "error": "Company not found"
}
```

**Server Error (500)**
```json
{
  "error": "Internal server error"
}
```

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation failed or malformed request |
| 401 | Unauthorized - Authentication required or invalid token |
| 409 | Conflict - Resource already exists (e.g., duplicate email) |
| 404 | Not Found - Requested resource not found |
| 500 | Internal Server Error - Server-side error |

---

## Error Response Format

All error responses follow this structure:

```json
{
  "error": "Error message",
  "details": [
    // Additional validation details (for 400 errors)
  ]
}
```

Validation errors include detailed information about which fields failed validation:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "type": "field",
      "msg": "Validation message",
      "path": "field_name",
      "location": "body"
    }
  ]
}
```

---

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds
2. **JWT Authentication**: Secure token-based authentication with 90-day expiry
3. **Input Sanitization**: All HTML content is sanitized to prevent XSS attacks
4. **Validation**: Comprehensive server-side validation using express-validator
5. **CORS**: Cross-Origin Resource Sharing enabled for secure API access
6. **Helmet**: Security headers automatically applied
7. **Rate Limiting**: Cloudinary integration includes built-in rate limiting

---

## File Upload (Cloudinary Integration)

Company logo uploads are handled via Cloudinary:

- **Supported formats**: Standard image formats (JPG, PNG, GIF, etc.)
- **File size limits**: As per Cloudinary free tier (10MB for images)
- **Storage**: Secure cloud storage with CDN delivery
- **URLs**: Returned as `secure_url` in responses

### Upload Example (curl)
```bash
curl -X POST http://localhost:5000/api/company/register \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Test Company" \
  -F "description=Test Description" \
  -F "logo=@/path/to/logo.jpg"
```

---

## Testing

The API includes comprehensive test coverage:

- **18 tests** across 3 test suites
- **Authentication tests**: Registration, login, validation
- **Company tests**: CRUD operations, authentication, validation  
- **Validation tests**: Input validation and error handling

Run tests with: `npm test`

---

## Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# JWT
JWT_SECRET=your-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=5000
NODE_ENV=production
```