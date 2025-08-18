import { cloudinary } from "../config/cloudinaryConfig.js";

const uploadFilesToCloudinary = async (files, folder = "uploads") => {
  const uploadPromises = files.map((file) => {
    const filePath = file.path;

    // Helper function that always returns a Promise
    const doUpload = (filePath, options) => {
      if (file.mimetype.startsWith("video/")) {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_large(
            filePath,
            { ...options, resource_type: "video" }, // 👈 force video here
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
        });
      } else {
        return cloudinary.uploader.upload(filePath, {
          ...options,
          resource_type: "image",
        });
      }
    };

    return doUpload(filePath, {
      folder,
      quality: "auto",
      fetch_format: "auto",
      use_filename: true,
      unique_filename: true,
    })
      .then((result) => ({
        public_id: result.public_id,
        secureUrl: result.secure_url,
        fileName: file.filename,
        fileId: file.filename,
        originalName: file.originalname,
        path: `/uploads/${folder}/${file.filename}`,
        resourceType: result.resource_type,
      }))
      .catch((error) => {
        console.error("Cloudinary upload failed for:", file.originalname, error);
        return null;
      });
  });

  const uploadedFiles = await Promise.all(uploadPromises);
  return uploadedFiles.filter((f) => f !== null);
};

export { uploadFilesToCloudinary };
