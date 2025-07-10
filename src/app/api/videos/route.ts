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

export async function GET() {
  const videos = readVideos();
  return NextResponse.json(videos);
}

export async function POST(request: Request) {
  const newVideo = await request.json();
  const videos = readVideos();
  videos.push(newVideo);
  writeVideos(videos);
  return NextResponse.json(newVideo, { status: 201 });
}
