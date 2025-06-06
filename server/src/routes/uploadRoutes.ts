import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: Function) {
    cb(null, 'uploads/');
  },
  filename: function (req: Request, file: Express.Multer.File, cb: Function) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  }
});

router.post('/', protect, admin, upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }
  res.json({
    url: `/${req.file.path.replace(/\\/g, '/')}`,
  });
});

export default router; 