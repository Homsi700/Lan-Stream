
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const videosFilePath = path.join(process.cwd(), 'src', 'data', 'videos.json');
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
    
    // Sanitize filename
    const cleanFilename = videoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${Date.now()}-${cleanFilename}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Convert file to buffer
    const buffer = Buffer.from(await videoFile.arrayBuffer());

    // Write file to disk
    fs.writeFileSync(filePath, buffer);

    const videos = readVideos();
    const newVideo = {
      id: Date.now(),
      title,
      link: `/uploads/${uniqueFilename}`,
    };

    videos.push(newVideo);
    writeVideos(videos);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Upload failed', error: error.message }, { status: 500 });
  }
}
