import multer from 'multer';
import { HttpError } from '../helpers';

const MAX_SIZE_BYTES = 20 * 1024 * 1024; //20Mb
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/mts'];

const storage = multer.memoryStorage();

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(HttpError(400, 'Invalid file type. Only MP4 and WEBM are allowed'));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

export default upload;
