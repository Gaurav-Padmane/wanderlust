const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,       // ✅ fixed spelling
    api_key: process.env.CLOUD_API_KEY,       // ✅ fixed spelling
    api_secret: process.env.CLOUD_API_SECRET  // ✅ fixed spelling
})

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