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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const updatedVideoData = await request.json();
  let videos = readVideos();
  const videoIndex = videos.findIndex(video => video.id === id);

  if (videoIndex > -1) {
    // If thumbnail is empty or just whitespace, revert to placeholder
    if (!updatedVideoData.thumbnail || updatedVideoData.thumbnail.trim() === '') {
        updatedVideoData.thumbnail = `https://placehold.co/600x400.png`;
    }
    videos[videoIndex] = { ...videos[videoIndex], ...updatedVideoData, id: id }; // Ensure ID is not changed
    writeVideos(videos);
    return NextResponse.json(videos[videoIndex], { status: 200 });
  } else {
    return NextResponse.json({ message: 'Video not found' }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  let videos = readVideos();
  const videoToDelete = videos.find(video => video.id === id);
  const initialLength = videos.length;
  
  videos = videos.filter(video => video.id !== id);

  if (videos.length < initialLength && videoToDelete) {
    writeVideos(videos);
    
    // If the video link points to a stream directory, delete it
    if (videoToDelete.link && videoToDelete.link.startsWith('/streams/')) {
        const streamId = videoToDelete.link.split('/')[2];
        const dirToDelete = path.join(streamDir, streamId);
        
        if (fs.existsSync(dirToDelete)) {
            fs.rm(dirToDelete, { recursive: true, force: true }, (err) => {
                if (err) {
                    console.error(`Failed to delete stream directory ${dirToDelete}:`, err);
                } else {
                    console.log(`Deleted stream directory: ${dirToDelete}`);
                }
            });
        }
    }

    return NextResponse.json({ message: 'Video deleted' }, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Video not found' }, { status: 404 });
  }
}
