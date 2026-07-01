import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

/**
 * Controller to handle file uploads.
 * If Cloudinary is configured, uploads the file buffer directly to Cloudinary.
 * Otherwise, falls back to disk storage and returns the local relative URL.
 */
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (isCloudinaryConfigured) {
      // Upload the memory buffer to Cloudinary using a stream
      const uploadStream = (buffer, options) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
          stream.end(buffer);
        });
      };

      const result = await uploadStream(req.file.buffer, {
        folder: 'portfolio',
        resource_type: 'auto'
      });

      return res.json({
        message: 'File uploaded successfully (Cloudinary)',
        fileUrl: result.secure_url
      });
    } else {
      // Fallback local file URL
      const fileUrl = `/uploads/${req.file.filename}`;
      return res.json({
        message: 'File uploaded successfully (Local)',
        fileUrl
      });
    }
  } catch (error) {
    next(error);
  }
};
