import express from 'express';
import { registerCompany, getCompanyProfile, uploadCompanyLogo, uploadCompanyBanner } from '../controllers/companyController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { companyValidation } from '../middleware/validateMiddleware.js';
import { uploadSingle, uploadFields, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Company profile routes
router.post('/register', authenticateUser, uploadFields, handleUploadError, companyValidation, registerCompany);
router.get('/profile', authenticateUser, getCompanyProfile);

// Image upload routes
router.post('/upload/logo', authenticateUser, uploadSingle('logo'), handleUploadError, uploadCompanyLogo);
router.post('/upload/banner', authenticateUser, uploadSingle('banner'), handleUploadError, uploadCompanyBanner);

export default router;
