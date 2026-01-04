const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Validate Cloudinary credentials early to fail fast in production
const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;
if (!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_API_SECRET) {
  console.error(
    'Missing Cloudinary credentials. Please set CLOUD_NAME, CLOUD_API_KEY, and CLOUD_API_SECRET.'
  );
  process.exit(1);
}

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_dev',
   allowedFormats: ["png", "jpg", "jpeg"],
  },
});

module.exports = {
    cloudinary,
    storage,
}