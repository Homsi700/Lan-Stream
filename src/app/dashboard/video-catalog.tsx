
'use client';

import { useState, useEffect } from 'react';
import { summarizeVideos, type VideoSummaryOutput } from '@/ai/flows/video-summary';
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

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;

    const fetchSummaries = async () => {
      setIsLoading(true);
      const storedVideosRaw = localStorage.getItem(VIDEOS_STORAGE_KEY);
      const storedVideos: Video[] = storedVideosRaw ? JSON.parse(storedVideosRaw) : [];

      if (storedVideos.length === 0) {
        setVideos([]);
        setIsLoading(false);
        return;
      }

      try {
        const videoTitles = storedVideos.map(v => v.title);
        // Using title as a placeholder for description as we don't have descriptions field
        const videoDescriptions = storedVideos.map(v => v.title);
        
        const result: VideoSummaryOutput = await summarizeVideos({ videoTitles, videoDescriptions });
        
        const videosWithSummaries = storedVideos.map((video, index) => ({
          ...video,
          summary: result.summaries[index] || t('videoCard.noSummary'),
        }));
        
        setVideos(videosWithSummaries);
      } catch (error) {
        console.error('Failed to get video summaries:', error);
        // Set videos with a fallback summary on error
        const videosWithFallback = storedVideos.map(video => ({
          ...video,
          summary: video.title, // Fallback to title if summary fails
        }));
        setVideos(videosWithFallback);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummaries();
  }, [isClient, t]);

  if (!isClient) {
    return (
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
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
