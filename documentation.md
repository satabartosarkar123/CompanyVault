# Documentation

## Overview

BlueStocks is a company verification platform composed of a PostgreSQL/Express backend and a React/Vite frontend. This document consolidates the setup instructions, configuration details, API reference, testing notes, and demo walkthrough so future contributors can work productively without hunting for context.

---

## Project Setup

### Prerequisites
- Node.js 18+ (tested with Node 20)
- npm 9+
- PostgreSQL 14+ reachable at `postgresql://<user>@localhost:5432/companydb`
- Cloudinary account (API key/secret) for logo/banner uploads
- (Optional) Firebase service account if integrating Firebase services

### Clone & Install
```bash
git clone <repo-url>
cd company-verification-module

# Backend
cd backend
npm install
cp .env.example .env   # if provided, otherwise use values below

# Frontend
cd ../frontend
npm install
cp .env.example .env   # if provided
```

### Environment Variables

`backend/.env`
```dotenv
PORT=5050
DATABASE_URL=postgresql://<user>@localhost:5432/companydb
JWT_SECRET=supersecretkey

# Firebase (optional)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

`frontend/.env`
```dotenv
VITE_BACKEND_URL=http://localhost:5050
# existing Firebase firebase config can stay if required
```

### Folder Layout
```
backend/
  src/
    config/          # database, cloudinary, firebase config
    controllers/     # auth and company controllers
    middleware/      # auth, validation, error handling, uploads
    models/          # DB access helpers
    routes/          # Express route definitions
    tests/           # Jest suites + request helpers
  scripts/
    verify-crud.mjs  # automated end-to-end smoke test

frontend/
  src/
    api/             # axios clients (auth/company)
    components/      # shared form steps
    pages/           # React pages (Login, Register, Dashboard, etc.)
    store/           # Redux slices + store
  tests/             # Testing Library mocks/helpers
```

---

## Running the App

```bash
# Start backend (nodemon)
cd backend
npm run dev

# Start frontend (Vite)
cd ../frontend
npm run dev
```

Backend listens on `http://localhost:5050`, frontend on `http://localhost:5173`.

---

## API Reference

All request bodies are JSON unless otherwise noted. Protected routes require the header `Authorization: Bearer <JWT>`.

| Route | Method | Body | Headers | Success | Errors | Description |
| ----- | ------ | ---- | ------- | ------- | ------ | ----------- |
/api/auth/register | POST | `email`, `password`, `fullname`, `gender (M/F)`, `mobileno`, `signuptype` | – | 201 | 400 (validation), 409 (duplicate) | Register a new account and return token + user |
/api/auth/login | POST | `email`, `password` | – | 200 | 400, 401 | Login existing user, return token + user + optional company |
/api/company/register | POST | `name`, `description?`, `address?` | `Authorization` | 201 | 400, 401 | Create first company profile for logged-in user |
/api/company/profile | GET | – | `Authorization` | 200 | 401 | Fetch current user's company profile |
/api/company/contact | PUT | `mapLocation`, `phone`, `email` | `Authorization` | 200 | 400, 401 | Update company contact info |
/api/company/profile (PUT) | PUT | `name?`, `about?`, `logoUrl?`, `bannerUrl?`, etc. | `Authorization` | 200 | 400, 401 | Update company basics (used by Profile/Settings) |
/api/company/contact | PUT | `mapLocation`, `phone`, `email` | `Authorization` | 200 | 400 | Update contact details |
/api/company/social-links | PUT | `socials: [{ platform, url }]` | `Authorization` | 200 | 400 | Update company social links |
/api/company/security | PUT | `currentPassword`, `newPassword`, `confirmPassword` | `Authorization` | 200 | 400, 401 | Change company account password |
/api/company (DELETE) | DELETE | – | `Authorization` | 204 | 401 | Delete company and associated user session |

### Request/Response Example

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Password123!"
}
```

Successful response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 12,
    "email": "admin@example.com",
    "fullname": "Admin User",
    "gender": "M",
    "mobileno": "1234567890",
    "signuptype": "email",
    "created_at": "2025-10-17T10:10:00.000Z"
  },
  "company": {
    "id": 8,
    "name": "BlueStocks Inc",
    "description": "...",
    "owner_id": 12,
    "logo_url": "...",
    "banner_url": "...",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

### Authentication Notes
- The JWT is generated on register/login and must be sent as `Authorization: Bearer <token>` for protected endpoints.
- Tokens expire in 90 days by default (see auth controller).
- Frontend stores the token in Redux; the axios interceptor (`src/api/authApi.js`) automatically attaches it to outgoing requests.

---

## Testing

### Automated
- **Backend**: `npm test -- --runInBand` (Jest suites for auth, company, validation). Uses pg-mem for isolated DB behavior.
- **Backend smoke**: `node scripts/verify-crud.mjs` – spins up the real server via `startServer()`, registers/logins/creates a company, cleans DB entries afterward.
- **Frontend**: `npm test -- --runInBand` (Testing Library). Currently covers login page form behaviors; extend similarly for register/settings.

All test commands currently pass.

### Manual
- Register & Login via UI (expect success and redirect to dashboard).
- Attempt registering with missing fields (UI validation).
- Submit duplicate email (expect toast with error from 409).
- Profile/Settings flows:
  - Update company info, contact, social links.
  - Change password (should require correct current password).
  - Delete company account (requires confirmation).
- Upload logo/banner (if endpoint wired; ensure Cloudinary credentials valid).
- Check that protected routes redirect to `/login` when JWT missing.
- Use Postman/Thunder Client with requests saved to a collection:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/company/register`
  - `GET /api/company/profile`
  - Additional update/delete endpoints
  - For each: test valid payload, invalid payload (e.g., missing fields), and missing/malformed JWT.

---

## Demo Walkthrough Script

1. **Start servers**: `npm run dev` in `backend/` and `frontend/`.
2. **Register a user/company** through the UI; highlight the network response containing token + user.
3. **Login flow**: show protected dashboard accessible with token; manually clear token to illustrate redirect back to login.
4. **Company profile**: complete profile form; update contact/social info; demonstrate immediate state update (Redux + APIs).
5. **Assets**: upload logo/banner (if Cloudinary configured) and show resulting URLs/store updates.
6. **Postman demo**: show 401 when Authorization header missing; add `Bearer <token>` to confirm 200 response.
7. **DB verification** (optional): display rows in `users`/`companies` using `psql` or pgAdmin.
8. **Documentation**: show this file plus any additional technical docs as hand-off resources.

---

## Additional Notes

- Ensure PostgreSQL database `companydb` exists before starting backend (`createdb companydb`).
- If running multiple services, update `.env` ports to avoid conflicts (default uses 5050).
- Axios interceptor depends on a singleton store import; if you restructure Redux, ensure the interceptor can still access the token.
- The Grammarly extension errors seen in console are benign and unrelated to app functionality.

---

Happy shipping! If you extend the API or add features, please update both the automated tests and this documentation so the next engineer (or future you) has a clear starting point.
