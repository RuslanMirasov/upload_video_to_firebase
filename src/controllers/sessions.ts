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

    const { mimetype, buffer } = req.file;

    const ext = mimetype === 'video/webm' ? 'webm' : 'mp4';

    const outputDir = path.join(__dirname, '../../public/camera/');
    const outputPath = path.join(outputDir, `session_${Date.now()}.${ext}`);

    await fs.mkdir(outputDir, { recursive: true });

    await cropVideo(buffer, outputPath, 110, 150);

    await fs.access(outputPath);

    res.status(200).json({
      url: `/camera/${path.basename(outputPath)}`,
    });
  } catch (error: unknown) {
    next(error);
  }
};
