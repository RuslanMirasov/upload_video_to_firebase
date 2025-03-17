import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sessionsRouter from './routes/api/sessions';
import { MulterError } from 'multer';
import { AppError } from './types/errors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static('public'));
app.use('/api/sessions', sessionsRouter);

app.use(async (req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(async (err: Error | MulterError | AppError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ message: 'The file is too large. The maximum size is 20MB' });
    return;
  }

  const status = 'status' in err && err.status ? err.status : 500;
  const message = err.message || 'Server error';
  res.status(status).json({ message });
});

export default app;
