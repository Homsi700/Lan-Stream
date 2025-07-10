"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Monitor, Wifi } from "lucide-react";

interface VideoPlayerProps {
  videoSrc: string;
}

export function VideoPlayer({ videoSrc }: VideoPlayerProps) {
  const [resolution, setResolution] = useState("1080");

  return (
    <div className="w-full max-w-6xl aspect-video bg-black flex flex-col items-center justify-center p-4">
      <div className="relative w-full h-full group">
        <video
          key={resolution} // Re-renders the video element on resolution change
          className="w-full h-full rounded-lg shadow-2xl shadow-primary/20"
          controls
          autoPlay
          // In a real app, you would change the source based on resolution
          // src={`${videoSrc}?resolution=${resolution}`}
        >
          {/* Using a placeholder video since we can't package one. */}
          <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Card className="bg-black/50 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Wifi className="h-5 w-5 text-green-400" />
                            <p className="text-sm font-medium">LAN</p>
                        </div>
                         <div className="flex items-center gap-2">
                             <Monitor className="h-5 w-5"/>
                            <Select value={resolution} onValueChange={setResolution}>
                            <SelectTrigger className="w-[120px] bg-transparent border-white/30 focus:ring-primary">
                                <SelectValue placeholder="Resolution" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1080">1080p HD</SelectItem>
                                <SelectItem value="720">720p HD</SelectItem>
                                <SelectItem value="480">480p SD</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <p className="text-xs text-white/60 mt-2">Adaptive bitrate simulation</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
