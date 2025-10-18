import { createCompany, getCompany, updateCompany } from "../models/companyModel.js";
import cloudinary from "../config/cloudinary.js";
import sanitizeHtml from 'sanitize-html';

/**
 * Register a new company profile with optional logo upload
 * 
 * @route POST /api/company/register
 * @access Private (JWT token required)
 * 
 * @headers {
 *   Authorization: 'Bearer <JWT_TOKEN>'
 * }
 * 
 * @body {
 *   name: string (required) - Company name (2-200 characters)
 *   description: string (optional) - Company description (max 1000 characters)
 *   address: string (optional) - Company address (max 500 characters)
 * }
 * 
 * @files {
 *   logo: File (optional) - Company logo image file
 * }
 * 
 * @returns {
 *   201: { id: number, name: string, description: string|null, address: string|null, logo: string|null, owner_id: number, created_at: string, updated_at: string }
 *   400: { error: 'Validation failed', details: ValidationError[] }
 *   401: { error: 'No token provided' | 'Invalid token' }
 *   500: { error: 'Internal server error' }
 * }
 */
export async function registerCompany(req, res, next) {
  try {
    const rawData = req.body;
    const sanitizedData = {
      name: sanitizeHtml(rawData.name),
      description: rawData.description ? sanitizeHtml(rawData.description) : null,
      address: rawData.address ? sanitizeHtml(rawData.address) : null
    };
    
    let logoUrl = null;
    let bannerUrl = null;
    
    // Handle logo upload
    if (req.files && req.files.logo) {
      const logoBuffer = req.files.logo[0].buffer;
      const logoUpload = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'company-logos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(logoBuffer);
      });
      logoUrl = logoUpload.secure_url;
    }
    
    // Handle banner upload
    if (req.files && req.files.banner) {
      const bannerBuffer = req.files.banner[0].buffer;
      const bannerUpload = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'company-banners' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(bannerBuffer);
      });
      bannerUrl = bannerUpload.secure_url;
    }
    
    const company = await createCompany({ 
      name: sanitizedData.name, 
      description: sanitizedData.description, 
      address: sanitizedData.address, 
      logo_url: logoUrl, 
      banner_url: bannerUrl,
      owner_id: req.user.id 
    });
    
    res.status(201).json(company);
  } catch (e) { next(e); }
}

/**
 * Get company profile for authenticated user
 * 
 * @route GET /api/company/profile
 * @access Private (JWT token required)
 * 
 * @headers {
 *   Authorization: 'Bearer <JWT_TOKEN>'
 * }
 * 
 * @returns {
 *   200: { id: number, name: string, description: string|null, address: string|null, logo: string|null, owner_id: number, created_at: string, updated_at: string }
 *   401: { error: 'No token provided' | 'Invalid token' }
 *   404: { error: 'Company not found' }
 *   500: { error: 'Internal server error' }
 * }
 */
export async function getCompanyProfile(req, res, next) {
  try {
    const company = await getCompany(req.user.id);
    res.json(company);
  } catch (e) { next(e); }
}

/**
 * Upload company logo
 * 
 * @route POST /api/company/upload/logo
 * @access Private (JWT token required)
 * 
 * @headers {
 *   Authorization: 'Bearer <JWT_TOKEN>'
 * }
 * 
 * @files {
 *   logo: File (required) - Company logo image file (max 5MB)
 * }
 * 
 * @returns {
 *   200: { message: string, logo_url: string }
 *   400: { error: string }
 *   401: { error: 'No token provided' | 'Invalid token' }
 *   404: { error: 'Company not found' }
 *   500: { error: 'Internal server error' }
 * }
 */
export async function uploadCompanyLogo(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No logo file provided' });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'company-logos' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Update company with new logo URL
    const company = await updateCompany(req.user.id, { logo_url: uploadResult.secure_url });
    
    res.json({ 
      message: 'Logo uploaded successfully', 
      logo_url: uploadResult.secure_url 
    });
  } catch (e) { next(e); }
}

/**
 * Upload company banner
 * 
 * @route POST /api/company/upload/banner
 * @access Private (JWT token required)
 * 
 * @headers {
 *   Authorization: 'Bearer <JWT_TOKEN>'
 * }
 * 
 * @files {
 *   banner: File (required) - Company banner image file (max 5MB)
 * }
 * 
 * @returns {
 *   200: { message: string, banner_url: string }
 *   400: { error: string }
 *   401: { error: 'No token provided' | 'Invalid token' }
 *   404: { error: 'Company not found' }
 *   500: { error: 'Internal server error' }
 * }
 */
export async function uploadCompanyBanner(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No banner file provided' });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'company-banners' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Update company with new banner URL
    const company = await updateCompany(req.user.id, { banner_url: uploadResult.secure_url });
    
    res.json({ 
      message: 'Banner uploaded successfully', 
      banner_url: uploadResult.secure_url 
    });
  } catch (e) { next(e); }
}
