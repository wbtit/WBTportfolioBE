import { cloudinary } from "../config/cloudinaryConfig.js";


const uploadFilesToCloudinary = async (files, folder = "uploads") => {
  const uploadPromises = files.map((file) => {
    const filePath = file.path;

    return cloudinary.uploader
      .upload(filePath, {
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
      }))
      .catch((error) => {
        console.error("Cloudinary upload failed for:", file.originalname, error);
        return null;
      });
  });

  const uploadedFiles = await Promise.all(uploadPromises);
  return uploadedFiles.filter((f) => f !== null);
};


export {uploadFilesToCloudinary}