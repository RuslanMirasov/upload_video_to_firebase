import { Request, Response, NextFunction } from 'express';
import { HttpError, cropVideo, uploadToFirebase } from '../helpers';
import path from 'path';
import fs from 'fs/promises';

export const sayHello = async (req: Request, res: Response): Promise<void> => {
  res.status(200).send({ message: 'Hello Foulks!' });
};

export const uploadVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      throw HttpError(400, 'No file uploaded');
    }

    const { buffer } = req.file;

    const fileName = `session_${Date.now()}.mp4`;

    const tempDir = path.join(__dirname, '../../temp/');
    const tempPath = path.join(tempDir, fileName);

    await fs.mkdir(tempDir, { recursive: true });

    await cropVideo(buffer, tempPath, 110, 150);

    const fileUrl = await uploadToFirebase(tempPath, `sessions/${fileName}`);

    await fs.unlink(tempPath);

    res.status(200).json({
      firebaseUrl: fileUrl,
    });
  } catch (error: unknown) {
    next(error);
  }
};
