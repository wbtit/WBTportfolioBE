
import { cloudinary } from "../config/cloudinaryConfig.js";
import fs from 'fs'
import path  from "path";

const updateCloudinaryFiles = async (existingFiles, newFiles, folder, localFolder = "uploads") => {
  // Step 1: Delete existing Cloudinary and local files
  const deletePromises = existingFiles.map(async (file) => {
    // Delete from Cloudinary
    if (file.public_id) {
      try {
        await cloudinary.uploader.destroy(file.public_id);
      } catch (error) {
        console.error(`Failed to delete Cloudinary file: ${file.public_id}`, error);
      }
    }

    // Delete from local storage
    if (file.path) {
      const localPath = path.join(process.cwd(), file.path);
      if (fs.existsSync(localPath)) {
        try {
          fs.unlinkSync(localPath);
        } catch (error) {
          console.error(`Failed to delete local file: ${localPath}`, error);
        }
      }
    }
  });

  await Promise.all(deletePromises);

  // Step 2: Upload new files to Cloudinary
  const uploadPromises = newFiles.map(async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        use_filename: true,
        unique_filename: true,
        quality: "auto",
        fetch_format: "auto",
      });

      return {
        public_id: result.public_id,
        secureUrl: result.secure_url,
        fileName: file.filename,
        originalName: file.originalname,
        path: `/${localFolder}/${folder}/${file.filename}`,
      };
    } catch (error) {
      console.error("Cloudinary upload failed for:", file.originalname, error);
      return null;
    }
  });

  const uploaded = await Promise.all(uploadPromises);
  return uploaded.filter((file) => file !== null);
};
export{updateCloudinaryFiles}
