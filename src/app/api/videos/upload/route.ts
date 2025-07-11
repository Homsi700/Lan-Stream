
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Formidable } from 'formidable';
import { Writable } from 'stream';

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


// formidable needs this to be added to the request
export const config = {
  api: {
    bodyParser: false,
  },
};

const formidableParse = (req: NextRequest) => new Promise<{fields: any, files: any}>((resolve, reject) => {
    const chunks: any[] = [];
    const formidable = new Formidable({
        maxFiles: 1,
        maxFileSize: 1024 * 1024 * 1024, // 1GB
        uploadDir,
        // rename the file to something unique
        filename: (name, ext, part) => {
            const originalFilename = part.originalFilename || `video-${Date.now()}`;
            const cleanFilename = originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
            return `${Date.now()}-${cleanFilename}`;
        },
        filter: function ({ mimetype }) {
            return mimetype && mimetype.includes("video");
        },
    });

    const form = formidable;
    
    // Create a writable stream to pipe the request body to
    const writable = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      },
      final(callback) {
        const buffer = Buffer.concat(chunks);
        // Once the stream is finished, parse the buffer
        form.parse(buffer, (err, fields, files) => {
          if (err) {
            return reject(err);
          }
          resolve({ fields, files });
        });
        callback();
      }
    });

    // Pipe the request body to the writable stream
    req.body?.pipeTo(new WritableStream({
        write(chunk) {
            writable.write(chunk);
        },
        close() {
            writable.end();
        }
    }));
});


export async function POST(req: NextRequest) {
  try {
    const { fields, files } = await formidableParse(req);

    const videoFile = files.video[0];
    const title = fields.title[0];

    if (!videoFile || !title) {
        return NextResponse.json({ message: 'Missing title or video file' }, { status: 400 });
    }

    const videos = readVideos();
    const newVideo = {
      id: Date.now(),
      title,
      link: `/uploads/${videoFile.newFilename}`,
    };

    videos.push(newVideo);
    writeVideos(videos);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Upload failed', error: error.message }, { status: 500 });
  }
}
