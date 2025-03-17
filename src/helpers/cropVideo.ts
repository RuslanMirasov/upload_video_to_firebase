import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { Readable } from 'stream';

ffmpeg.setFfmpegPath(ffmpegPath as string);

const cropVideo = (buffer: Buffer, outputPath: string, width: number, height: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = Readable.from(buffer);

    ffmpeg(stream)
      .videoCodec('libvpx')
      .outputOptions(['-b:v 1000k', '-crf 28', '-an', '-map_metadata -1', '-map_chapters -1', '-threads 2', '-vsync 1'])
      .videoFilters([`scale=${width}:${height}:force_original_aspect_ratio=increase`, `crop=${width}:${height}`])
      .format('webm')
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
};

export default cropVideo;
