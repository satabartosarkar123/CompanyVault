import multer from 'multer';
import path from 'path';

// Configure multer for memory storage (files stored in memory as Buffer)
const storage = multer.memoryStorage();

// File filter function to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
  }
};

// Configure multer with options
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1 // Only one file at a time
  }
});

// Middleware for single file upload
export const uploadSingle = (fieldName) => upload.single(fieldName);

// Middleware for multiple file uploads (logo and banner)
export const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]);

// Error handling middleware for multer errors
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files uploaded.' });
    }
    return res.status(400).json({ error: 'File upload error: ' + err.message });
  }
  
  if (err.message.includes('Only image files are allowed')) {
    return res.status(400).json({ error: err.message });
  }
  
  next(err);
};