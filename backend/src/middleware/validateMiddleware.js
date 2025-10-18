import { body, validationResult } from 'express-validator';

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User registration validation
export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Valid email required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('fullname')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('gender')
    .isIn(['M', 'F'])
    .withMessage('Gender must be M or F'),
  body('mobileno')
    .isLength({ min: 8, max: 15 })
    .withMessage('Mobile number must be between 8 and 15 digits'),
  body('signuptype')
    .isIn(['email', 'google', 'facebook'])
    .withMessage('Signup type must be email, google, or facebook'),
  handleValidationErrors
];

// User login validation
export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Valid email required')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Company registration validation
export const companyValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Company name must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),
  handleValidationErrors
];
