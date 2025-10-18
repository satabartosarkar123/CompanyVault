# Frontend Structure Documentation

## 📁 Directory Structure

```
frontend/src/
├── pages/                  # Main application pages
│   ├── Login.jsx          # User login page
│   ├── Register.jsx       # User registration page  
│   ├── Dashboard.jsx      # Main dashboard page
│   ├── Profile.jsx        # Company profile management
│   ├── Settings.jsx       # Account settings page
│   ├── NotFound.jsx       # 404 error page
│   └── index.js          # Export all pages
│
├── components/            # Shared UI components
│   ├── Navbar.jsx        # Navigation bar component
│   ├── LoadingSpinner.jsx # Loading indicator
│   ├── ProtectedRoute.jsx # Route guard for auth
│   └── index.js          # Export all components
│
├── store/                # Redux state management
│   ├── store.js          # Redux store configuration
│   ├── authSlice.js      # Authentication state slice
│   └── companySlice.js   # Company profile state slice
│
├── api/                  # API service functions
│   ├── authApi.js        # Authentication API calls
│   └── companyApi.js     # Company profile API calls
│
├── styles/               # Custom CSS/styling
│   └── main.css         # Main stylesheet with CSS variables
│
└── assets/              # Static assets
    ├── logo.svg         # Company logo
    └── react.svg        # React logo (default)
```

## 📄 File Descriptions

### Pages (`/pages`)

**Login.jsx**
- User authentication form
- Email/password validation
- Redux integration for auth state
- Redirects to dashboard on success

**Register.jsx** 
- User registration form
- Full validation (email, password, name, gender, mobile)
- Multi-field form with proper error handling
- Automatic login after registration

**Dashboard.jsx**
- Main application landing page
- Company profile overview
- Statistics cards (profile completion, verification status)
- Quick action buttons
- Responsive design

**Profile.jsx**
- Company profile creation/editing
- File upload for logo and banner images
- Form validation for company details
- Integration with Cloudinary for image uploads

**Settings.jsx**
- Account management interface
- Tabbed navigation (Account, Security, Notifications, Danger Zone)
- Password change functionality
- Account deletion option

**NotFound.jsx**
- 404 error page with helpful links
- Dynamic navigation based on auth status
- Professional error messaging

### Components (`/components`)

**Navbar.jsx**
- Responsive navigation bar
- User dropdown menu
- Mobile hamburger menu
- Route highlighting for active page
- Authentication-aware navigation

**LoadingSpinner.jsx**
- Configurable loading indicator
- Multiple sizes (small, medium, large)
- Custom loading text
- CSS animations

**ProtectedRoute.jsx**
- Route guard component
- Redirects unauthenticated users
- Loading state handling
- Preserves intended destination

### Store (`/store`)

**store.js**
- Redux Toolkit store configuration
- Middleware setup
- Root reducer combining

**authSlice.js**
- Authentication state management
- Actions: login, register, logout, updateUser
- Async thunks for API calls
- localStorage persistence
- Comprehensive selectors

**companySlice.js**
- Company profile state management
- Actions: create, update, fetch profile
- File upload state tracking
- Upload progress monitoring
- Error handling

### API (`/api`)

**authApi.js**
- Authentication API service
- Functions: register, login, logout, verifyToken
- JWT token management
- Error handling and response parsing
- Header configuration

**companyApi.js**
- Company profile API service
- CRUD operations for company data
- File upload with progress tracking
- FormData handling for multipart requests
- Cloudinary integration support

### Styles (`/styles`)

**main.css**
- CSS custom properties (variables)
- Base styles and resets
- Component styling
- Responsive design utilities
- Animation keyframes
- Form styling
- Button variants
- Loading animations

### Assets (`/assets`)

**logo.svg**
- Custom BlueStocks logo
- SVG format for scalability
- Professional design with company colors

## 🔧 Key Features

### State Management
- Redux Toolkit for efficient state management
- Persistent authentication state
- Optimistic updates for better UX
- Error handling and loading states

### Routing
- React Router DOM for navigation
- Protected routes with authentication
- Dynamic redirects based on auth status
- 404 handling with helpful navigation

### API Integration
- RESTful API communication
- JWT token authentication
- File upload with progress tracking
- Error handling and user feedback

### Form Handling
- Client-side validation
- Real-time error feedback
- File upload with preview
- Multi-step form support

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly navigation
- Optimized for all screen sizes

### Security
- JWT token storage and management
- Protected routes
- Input sanitization
- CSRF protection ready

## 🚀 Usage

### Starting Development
```bash
cd frontend
npm install
npm run dev
```

### Building for Production
```bash
npm run build
```

### Dependencies Added
- `@reduxjs/toolkit` - State management
- `react-redux` - React-Redux bindings
- `react-router-dom` - Client-side routing
- `firebase` - Authentication service (already installed)

## 📱 Pages Overview

1. **Login** (`/login`) - Authentication entry point
2. **Register** (`/register`) - New user registration  
3. **Dashboard** (`/dashboard`) - Main application hub
4. **Profile** (`/profile`) - Company profile management
5. **Settings** (`/settings`) - Account and preferences
6. **404** (`/*`) - Error page for invalid routes

All pages are fully functional with proper state management, API integration, and responsive design.