
"use client";

import { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import { useTranslation } from '@/hooks/use-translation';

interface VideoPlayerProps {
  videoSrc: string;
}

export function VideoPlayer({ videoSrc }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check if the source is an HLS manifest
    if (videoSrc.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (e.g., Safari)
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', () => {
          video.play();
        });
      }
    } else {
      // It's a regular MP4 or other direct video file
      video.src = videoSrc;
      video.play();
    }
  }, [videoSrc]);
  
  return (
    <div className="w-full max-w-6xl aspect-video bg-black flex flex-col items-center justify-center p-4">
      <div className="relative w-full h-full group">
        <video
          ref={videoRef}
          className="w-full h-full rounded-lg shadow-2xl shadow-primary/20"
          controls
          autoPlay
        >
          {t('videoPlayer.browserNotSupported')}
        </video>
      </div>
    </div>
  );
}
