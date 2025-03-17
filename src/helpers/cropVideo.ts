import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { Readable } from 'stream';

ffmpeg.setFfmpegPath(ffmpegPath as string);

const cropVideo = (buffer: Buffer, outputPath: string, width: number, height: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = Readable.from(buffer);

    ffmpeg(stream)
      .videoCodec('libx264')
      .outputOptions(['-b:v 1000k', '-crf 30', '-quality good', '-an', '-map_metadata -1', '-map_chapters -1', '-movflags +faststart'])
      .videoFilters([`scale=${width}:${height}:force_original_aspect_ratio=increase`, `crop=${width}:${height}`])
      .format('mp4')
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
};

export default cropVideo;
