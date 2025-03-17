import { Router } from 'express';
import { uploadVideo } from '../../controllers/sessions';
import upload from '../../middlewares/upload';

const router = Router();

router.post('/', upload.single('video'), uploadVideo);

export default router;
