const cloudinary = require('cloudinary').v2;

async function uploadToCloudinary(file, folder, height, quality) {
    try {
        let options = { folder };
        options.resource_type = 'auto';

        if (height) options.height = height;
        if (quality) options.quality = quality;

        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

module.exports = { uploadToCloudinary };