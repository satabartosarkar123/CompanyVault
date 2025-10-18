import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

(async () => {
  try {
    console.log('Testing Cloudinary configuration...');
    console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing');
    console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing');
    
    // Test the connection by trying to get account info
    const result = await cloudinary.v2.api.usage();
    console.log('✅ Cloudinary connection successful!');
    console.log('Account usage:', result);
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error.message);
  }
})();