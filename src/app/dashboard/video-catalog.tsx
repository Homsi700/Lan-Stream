
'use client';

import { useState, useEffect } from 'react';
import { VideoCard, VideoCardSkeleton } from '@/components/video-card';
import { useTranslation } from '@/hooks/use-translation';

const VIDEOS_STORAGE_KEY = 'lan_stream_videos';

export interface Video {
  id: number;
  title: string;
  link: string;
  summary?: string;
}

export function VideoCatalog() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { t } = useTranslation();

  const loadVideos = () => {
    const storedVideosRaw = localStorage.getItem(VIDEOS_STORAGE_KEY);
    const storedVideos: Video[] = storedVideosRaw ? JSON.parse(storedVideosRaw) : [];
    const videosWithFallbackSummary = storedVideos.map(v => ({...v, summary: v.title}));
    setVideos(videosWithFallbackSummary);
  }

  useEffect(() => {
    setIsClient(true);
    loadVideos();
    setIsLoading(false);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === VIDEOS_STORAGE_KEY) {
        loadVideos();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  if (!isClient || isLoading) {
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
