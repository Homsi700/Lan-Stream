import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const videosFilePath = path.join(process.cwd(), 'src', 'data', 'videos.json');

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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  let videos = readVideos();
  const initialLength = videos.length;
  videos = videos.filter(video => video.id !== id);

  if (videos.length < initialLength) {
    writeVideos(videos);
    return NextResponse.json({ message: 'Video deleted' }, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Video not found' }, { status: 404 });
  }
}
