

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const videosFilePath = path.join(process.cwd(), 'src', 'data', 'videos.json');
const streamDir = path.join(process.cwd(), 'public', 'streams');

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
  let videos = readVideos();
  let wasUpdated = false;
  // Check processing status
  videos = videos.map(video => {
      if (video.processing) {
          const streamId = video.link.split('/')[2];
          const masterPlaylistPath = path.join(streamDir, streamId, 'master.m3u8');
          if (fs.existsSync(masterPlaylistPath)) {
              // If master playlist exists, processing is done
              delete video.processing;
              wasUpdated = true;
          }
      }
      return video;
  });
  
  if (wasUpdated) {
    writeVideos(videos); // Update the json file only if a change occurred
  }

  return NextResponse.json(videos);
}

export async function POST(request: Request) {
  const newVideo = await request.json();
  const videos = readVideos();
  videos.push(newVideo);
  writeVideos(videos);
  return NextResponse.json(newVideo, { status: 201 });
}
