import { Request, Response, NextFunction } from 'express';
import { HttpError, cropVideo, uploadToFirebase } from '../helpers';
import path from 'path';
import fs from 'fs/promises';
import { exec } from 'child_process';

export const uploadVideo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      throw HttpError(400, 'No file uploaded');
    }

    const { buffer } = req.file;

    const fileName = `session_${Date.now()}.webm`;

    const tempDir = path.join(__dirname, '../../temp/');

    const tempPath = path.join(tempDir, fileName);

    await fs.mkdir(tempDir, { recursive: true });

    exec('ffmpeg -codecs', (error, stdout, stderr) => {
      console.log('🔥 FFmpeg Available Codecs:', stdout);
      console.log('🔥 FFmpeg Errors:', stderr);
    });
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
