# Company Verification Module

A full-stack web application for company verification with user authentication, company profile management, and image upload capabilities.

link (vercel) : mycompanyvault.vercel.app

## 🎯 Project Status: **COMPLETE** ✅

### Phase 1: Setup - **100% Complete**
- ✅ **Repository Initialization**: Git repository with initial commit
- ✅ **Frontend Setup**: Vite + React 19 with Firebase integration
- ✅ **Backend Setup**: Node.js + Express with proper project structure
- ✅ **Database Setup**: PostgreSQL 15 with `companydb` database and schema
- ✅ **Cloud Integrations**: Firebase Auth + Cloudinary configured
- ✅ **Dependencies**: All required packages installed and configured

### Phase 2: Backend Development - **100% Complete**
- ✅ **Authentication APIs**: `/api/auth/register` and `/api/auth/login`
- ✅ **Company Profile APIs**: `/api/company/register` and `/api/company/profile`
- ✅ **Image Upload APIs**: `/api/company/upload/logo` and `/api/company/upload/banner`
- ✅ **Security Features**: JWT tokens (90-day), bcrypt, helmet, CORS, input validation
- ✅ **Testing**: 18 passing tests with Jest + Supertest
- ✅ **Documentation**: Comprehensive API documentation in code

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x LTS
- PostgreSQL 15
- Git

### Installation & Setup

1. **Database Setup**
   ```bash
   # Start PostgreSQL service
   brew services start postgresql@15
   
   # Import database schema
   psql -d companydb -f companydb.sql
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm test          # Run tests
   npm run dev       # Start development server
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev       # Start development server
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication

### Company Management
- `POST /api/company/register` - Create company profile (with optional logo/banner)
- `GET /api/company/profile` - Get company profile
- `POST /api/company/upload/logo` - Upload company logo
- `POST /api/company/upload/banner` - Upload company banner

## 🧪 Testing

```bash
cd backend
npm test                    # Run all tests (18 tests)
npm run test:cloudinary    # Test Cloudinary integration
```

**Test Results**: ✅ 18/18 tests passing
- Authentication tests: 3/3 ✅
- Company profile tests: 8/8 ✅  
- Validation tests: 7/7 ✅

## 🔧 Technology Stack

### Backend
- **Runtime**: Node.js 20.x LTS
- **Framework**: Express 5.x
- **Database**: PostgreSQL 15
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer + Cloudinary
- **Testing**: Jest + Supertest
- **Security**: Helmet, CORS, express-validator, sanitize-html

### Frontend  
- **Framework**: React 19
- **Build Tool**: Vite 7.x
- **Authentication**: Firebase Auth
- **Environment**: Environment variables configured

### Cloud Services
- **Authentication**: Firebase
- **Image Storage**: Cloudinary
- **Database**: PostgreSQL (local development)

## 📂 Project Structure

```
company-verification-module/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration files
│   │   └── tests/           # Test suites
│   ├── package.json
│   └── jest.config.js
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── firebase.js      # Firebase configuration
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
├── companydb.sql            # Database schema
├── README.md
└── .gitignore
```

## 🔐 Environment Variables

**Backend (.env)**:
- `PORT=5050`
- `DATABASE_URL=postgresql://satabarto@localhost:5432/companydb`
- `JWT_SECRET=supersecretkey`
- Firebase credentials
- Cloudinary credentials

**Frontend (.env)**:
- Firebase configuration
- `VITE_BACKEND_URL=http://localhost:5050`

## 🎉 Features Implemented

- ✅ User registration and authentication
- ✅ JWT-based session management (90-day validity)
- ✅ Company profile creation and retrieval
- ✅ Image upload for company logos and banners
- ✅ Input validation and sanitization
- ✅ Error handling and logging
- ✅ Comprehensive test coverage
- ✅ Database schema with triggers
- ✅ Security middleware (CORS, Helmet, etc.)
- ✅ File upload validation (image types, size limits)

- ✅ Documentation compiled in [`documentation.md`](./documentation.md) for setup, API usage, testing, and demo prep

## 🔄 Next Steps (Future Development)

1. **Frontend Development**: Build React components for UI
2. **Email Verification**: Implement Firebase email verification
3. **SMS OTP**: Add mobile verification via Firebase
4. **Company Verification**: Admin approval workflow
5. **Deployment**: Production deployment setup
6. **API Documentation**: Generate OpenAPI/Swagger docs

---

**Status**: Ready for Phase 3 frontend development and additional features! 🚀

## 🚀 Deployment (Vercel + GitHub)

### GitHub Preparation
- Confirm secrets are stored only in `.env` files (already gitignored).
- Commit the latest changes: `git add . && git commit -m "chore: prepare release"`.
- Push to your GitHub repository.

### Frontend on Vercel
1. In Vercel, create a new project and select your GitHub repo.
2. When prompted for the project root, choose `frontend/`.
3. Set build settings:
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `dist`
4. Add environment variables in Vercel:
   - `VITE_BACKEND_URL` → URL of your deployed backend (e.g., `https://api.example.com`).
   - Any Firebase keys your frontend needs.
5. Deploy. Vercel will run the build and host the static files.

### Backend Hosting Options
Host the Express backend on Render, Railway, Azure, or another Node-friendly platform. Provide the same `.env` values (Postgres connection string, JWT secret, Cloudinary keys) and ensure CORS allows your Vercel domain.

### Local Production Test
```bash
cd frontend
npm run build
npm run preview   # serves the built app at http://localhost:4173
```

Update `VITE_BACKEND_URL` to your production API before redeploying the frontend.
