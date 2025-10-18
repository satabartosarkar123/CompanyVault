import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

(async () => {
  const result = await cloudinary.v2.uploader.upload('path/to/test-image.jpg');
  console.log(result.secure_url);
})();
