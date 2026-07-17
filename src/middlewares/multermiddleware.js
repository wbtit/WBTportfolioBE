import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid';

function createMulterUploader(uploadDir, fileMap) {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueId = uuidv4();
      const ext = path.extname(file.originalname);
      const newFileName = `${uniqueId}${ext}`;
      fileMap[newFileName] = {
        originalname: file.originalname,
        uuid: uniqueId,
        mimetype: file.mimetype,
      };
      cb(null, newFileName);
    },
  });

  return multer({
    storage,
    fileFilter: (req, file, cb) => cb(null, true),
  });
}
export const UploadedFilesMap = {};
export const uploads = createMulterUploader("uploads/projectFiles", UploadedFilesMap);

export const UploadedPortfolioFilesMap = {};
export const PWuploads = createMulterUploader("uploads/portfolioWorkFiles", UploadedPortfolioFilesMap);

export const UploadedJDMap = {};
export const JDuploads = createMulterUploader("uploads/JobRoleFiles", UploadedJDMap);

export const UploadedApplicationMap={}
export const Applications=createMulterUploader("uploads/Applicants",UploadedApplicationMap)

export const UploadedBlogFiles={}
export const blogFiles=createMulterUploader("uploads/blogFiles",UploadedBlogFiles)

export const UploadedLeadershipMap={}
export const leadershipPics=createMulterUploader("uploads/leadershipPics",UploadedLeadershipMap)
