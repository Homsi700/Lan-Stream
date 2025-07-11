
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const videosFilePath = path.join(process.cwd(), 'src', 'data', 'videos.json');
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
const streamDir = path.join(process.cwd(), 'public', 'streams');

// Ensure directories exist
[uploadDir, streamDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const readVideos = (): any[] => {
  try {
    const data = fs.readFileSync(videosFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeVideos = (videos: any[]) => {
  fs.writeFileSync(videosFilePath, JSON.stringify(videos, null, 2));
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string | null;
    const videoFile = formData.get('video') as File | null;

    if (!title || !videoFile) {
        return NextResponse.json({ message: 'Missing title or video file' }, { status: 400 });
    }
    
    // 1. Save original file temporarily
    const tempFilename = `${Date.now()}-${videoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const tempFilePath = path.join(uploadDir, tempFilename);
    const buffer = Buffer.from(await videoFile.arrayBuffer());
    fs.writeFileSync(tempFilePath, buffer);

    // 2. Prepare for HLS transcoding
    const streamId = `${Date.now()}`;
    const outputDir = path.join(streamDir, streamId);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // FFmpeg command to create multiple resolutions
    const resolutions = [
        { name: '360p', w: 640, h: 360, bv: '800k', maxrate: '856k', bufsize: '1200k', ba: '96k' },
        { name: '480p', w: 842, h: 480, bv: '1400k', maxrate: '1498k', bufsize: '2100k', ba: '128k' },
        { name: '720p', w: 1280, h: 720, bv: '2800k', maxrate: '2996k', bufsize: '4200k', ba: '128k' },
    ];

    const ffmpegCommands = resolutions.map(res => 
        `-vf "scale=w=${res.w}:h=${res.h}:force_original_aspect_ratio=decrease,pad=w=${res.w}:h=${res.h}:x=(ow-iw)/2:y=(oh-ih)/2" ` +
        `-c:a aac -ar 48000 -b:a ${res.ba} ` +
        `-c:v h264 -profile:v main -crf 20 -g 48 -keyint_min 48 -sc_threshold 0 -b:v ${res.bv} -maxrate ${res.maxrate} -bufsize ${res.bufsize} ` +
        `-hls_time 10 -hls_playlist_type vod -hls_segment_filename "${path.join(outputDir, res.name)}_%03d.ts" "${path.join(outputDir, res.name)}.m3u8"`
    ).join(' ');

    const finalFfmpegCommand = `ffmpeg -i "${tempFilePath}" ${ffmpegCommands}`;
    
    console.log('Executing FFmpeg command:', finalFfmpegCommand);
    
    // Execute FFmpeg (This can take a long time)
    // We don't await this, it runs in the background. We just add the video to the list.
    execPromise(finalFfmpegCommand)
        .then(() => {
            console.log(`Transcoding finished for ${title}`);
            // Create master playlist
            const masterPlaylistContent = '#EXTM3U\n' +
                resolutions.map(res => `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(res.bv, 10) * 1000},RESOLUTION=${res.w}x${res.h}\n${res.name}.m3u8`).join('\n');
            fs.writeFileSync(path.join(outputDir, 'master.m3u8'), masterPlaylistContent);
        })
        .catch(err => {
            console.error(`FFmpeg error for ${title}:`, err);
            if (err.message.includes('not recognized') || err.message.includes('not found')) {
                console.error('Hint: FFmpeg might not be installed or is not in your system\'s PATH. Please check the README.md for installation instructions.');
            }
        })
        .finally(() => {
            // Clean up temporary file
            fs.unlink(tempFilePath, (err) => {
                if (err) console.error(`Failed to delete temp file ${tempFilePath}:`, err);
            });
        });

    // 3. Add video to JSON immediately, pointing to the future stream URL
    const videos = readVideos();
    const newVideo = {
      id: Date.now(),
      title,
      link: `/streams/${streamId}/master.m3u8`, // This is the HLS manifest link
      processing: true, // Add a flag to indicate processing
    };

    videos.push(newVideo);
    writeVideos(videos);

    return NextResponse.json(newVideo, { status: 201 });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Upload failed', error: error.message }, { status: 500 });
  }
}
