import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/avatars';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|webp/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'));
  }
};

export const uploadAvatarMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

// Configure multer storage for manuscripts
const manuscriptStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/manuscripts';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'manuscript-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for manuscripts (PDF, DOCX)
const manuscriptFileFilter = (req, file, cb) => {
  const allowedFileTypes = /pdf|doc|docx/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype) || file.mimetype.includes('pdf') || file.mimetype.includes('wordprocessingml');

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF or DOCX files are allowed for manuscripts!'));
  }
};

export const uploadManuscriptMiddleware = multer({
  storage: manuscriptStorage,
  fileFilter: manuscriptFileFilter,
  limits: { fileSize: 1024 * 1024 * 25 } // 25MB limit
});
