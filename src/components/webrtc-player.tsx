"use client";

import { useRef, useEffect } from 'react';

// webrtc-player doesn't have official types or ES module support.
// We use require and ts-ignore to handle it.
// @ts-ignore
const WebRTCPlayer = require('webrtc-player');

interface WebRTCPlayerProps {
  signalingUrl: string;
  username?: string;
  password?: string;
}

export function WebRTCPlayerComponent({ signalingUrl, username, password }: WebRTCPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let player: any = null;

    try {
      console.log(`Initializing WebRTC Player for URL: ${signalingUrl}`);
      player = new WebRTCPlayer(video, {
        type: 'whep', // WebRTC-HTTP Egress Protocol, common for broadcasting
        url: signalingUrl,
        username: username,
        password: password,
      });

      player.on('error', (e: any) => {
        console.error('WebRTC Player Error:', e);
      });

      player.on('disconnected', () => {
        console.log('WebRTC Player disconnected');
      });

      player.on('connected', () => {
        console.log('WebRTC Player connected successfully.');
      });

    } catch (e) {
      console.error("Failed to initialize WebRTC Player:", e);
    }
    
    // Cleanup function
    return () => {
      if (player) {
        console.log('Closing WebRTC Player.');
        player.close();
      }
    };
  }, [signalingUrl, username, password]);
  
  return (
    <div className="w-full max-w-6xl aspect-video bg-black flex flex-col items-center justify-center p-4">
      <div className="relative w-full h-full group">
        <video
          ref={videoRef}
          className="w-full h-full rounded-lg shadow-2xl shadow-primary/20"
          controls
          autoPlay
          muted
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
