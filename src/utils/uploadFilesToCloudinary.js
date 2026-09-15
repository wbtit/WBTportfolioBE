import { cloudinary } from "../config/cloudinaryConfig.js";
import fs from "fs";
import path from "path";

const uploadFilesToCloudinary = async (files, folder = "uploads") => {
  const uploadPromises = files.map(async (file) => {
    const filePath = file.path;

    const doUpload = (uploadPath, options) => {
      if (file.mimetype.startsWith("video/")) {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_large(
            uploadPath,
            { ...options, resource_type: "video" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
        });
      } else {
        return cloudinary.uploader.upload(uploadPath, {
          ...options,
          resource_type: "image",
        });
      }
    };

    try {
      const result = await doUpload(filePath, {
        folder,
        quality: "auto",
        fetch_format: "auto",
        use_filename: true,
        unique_filename: true,
      });

      return {
        public_id: result.public_id,
        secureUrl: result.secure_url,
        fileName: file.filename,
        fileId: file.filename,
        originalName: file.originalname,
        path: result.secure_url, // Using Cloudinary URL as the path since it's not stored locally
        resourceType: result.resource_type,
      };
    } catch (error) {
      console.error("Cloudinary upload failed for:", file.originalname, error);

      return {
        public_id: null,
        secureUrl: null,
        fileName: file.filename,
        fileId: file.filename,
        originalName: file.originalname,
        path: null,
        resourceType: file.mimetype.split("/")[0],
      };
    } finally {
      // Remove the temporary multer file from the local system
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  });

  const uploadedFiles = await Promise.all(uploadPromises);
  return uploadedFiles;
};

export { uploadFilesToCloudinary };
