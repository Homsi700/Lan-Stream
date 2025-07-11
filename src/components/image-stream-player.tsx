
"use client";
import Image from 'next/image';

interface ImageStreamPlayerProps {
  streamSrc: string;
}

export function ImageStreamPlayer({ streamSrc }: ImageStreamPlayerProps) {
  return (
    <div className="w-full max-w-6xl aspect-video bg-black flex flex-col items-center justify-center p-4">
      <div className="relative w-full h-full group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={streamSrc}
          alt="Live IP Camera Stream"
          className="w-full h-full object-contain rounded-lg shadow-2xl shadow-primary/20"
          // Add an error handler for better UX
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.alt = "Failed to load stream. Check camera and network.";
            // Optionally, replace with a placeholder image on error
            // target.src = 'https://placehold.co/1280x720.png'; 
          }}
        />
      </div>
    </div>
  );
}
