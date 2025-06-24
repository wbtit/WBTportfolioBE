import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = 'uploads/projectFiles';

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Optional: expose file map for tracking if needed
export const UploadedFilesMap = {};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    const newFileName = `${uniqueId}${ext}`;

    UploadedFilesMap[newFileName] = {
      originalname: file.originalname,
      uuid: uniqueId,
      mimetype: file.mimetype,
    };

    cb(null, newFileName);
  },
});

// No file type restriction or size limit
export const uploads = multer({
  storage,
  fileFilter: (req, file, cb) => cb(null, true),
});
