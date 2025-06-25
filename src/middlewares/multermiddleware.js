import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = 'uploads/projectFiles';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
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

export const uploads = multer({
  storage,
  fileFilter: (req, file, cb) => cb(null, true),
});

// ----------------portfolioWork-----------------------
const UPLOAD_DIR_PW = 'uploads/portfolioWorkFiles';
if (!fs.existsSync(UPLOAD_DIR_PW)) {
  fs.mkdirSync(UPLOAD_DIR_PW, { recursive: true });
}

export const UploadedPortfolioFilesMap = {};

const pwStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR_PW);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    const newFileName = `${uniqueId}${ext}`;
    UploadedPortfolioFilesMap[newFileName] = {
      originalname: file.originalname,
      uuid: uniqueId,
      mimetype: file.mimetype,
    };
    cb(null, newFileName);
  },
});

export const PWuploads = multer({
  storage: pwStorage,
  fileFilter: (req, file, cb) => cb(null, true),
});


// ----------------JobRole-----------------------
const UPLOAD_DIR_JD = 'uploads/JobRoleFiles/';
if (!fs.existsSync(UPLOAD_DIR_JD)) {
  fs.mkdirSync(UPLOAD_DIR_JD, { recursive: true });
}

export const UploadedJDMap = {};

const JDStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR_JD);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    const newFileName = `${uniqueId}${ext}`;
    UploadedJDMap[newFileName] = {
      originalname: file.originalname,
      uuid: uniqueId,
      mimetype: file.mimetype,
    };
    cb(null, newFileName);
  },
});

export const JDuploads = multer({
  storage: JDStorage,
  fileFilter: (req, file, cb) => cb(null, true),
});
