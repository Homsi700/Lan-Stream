
'use client';

import { useState, useEffect } from 'react';
import { VideoCard, VideoCardSkeleton } from '@/components/video-card';
import { useTranslation } from '@/hooks/use-translation';
import { Loader2 } from 'lucide-react';

export interface Video {
  id: number;
  title: string;
  link: string;
  summary?: string;
  thumbnail?: string;
  processing?: boolean;
}

export function VideoCatalog() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchVideos = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/videos');
            const data = await response.json();
            setVideos(data);
        } catch (error) {
            console.error('Failed to fetch videos:', error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchVideos();
  }, []);

  if (isLoading) {
    return (
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-64 border-2 border-dashed rounded-lg">
        <p className="text-lg font-semibold text-primary">{t('videoCard.noVideos.title')}</p>
        <p className="text-muted-foreground">{t('videoCard.noVideos.description')}</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
