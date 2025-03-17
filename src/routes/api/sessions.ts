import { Router } from 'express';
import { sayHello, uploadVideo } from '../../controllers/sessions';
import { upload } from '../../helpers';

const router = Router();

router.get('/', sayHello);
router.post('/', upload.single('video'), uploadVideo);

export default router;
