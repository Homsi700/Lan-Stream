'use client';

import { useState, useEffect } from 'react';
import { summarizeVideos, type VideoSummaryOutput } from '@/ai/flows/video-summary';
import { VideoCard, VideoCardSkeleton } from '@/components/video-card';

const mockVideos = [
  { id: '1', title: 'Company All-Hands Q1', description: 'Quarterly all-hands meeting covering Q1 results and Q2 roadmap.', thumbnailUrl: 'https://placehold.co/600x400.png', dataAiHint: 'corporate meeting' },
  { id: '2', title: 'New Employee Onboarding', description: 'A welcome video for new hires, covering company culture and policies.', thumbnailUrl: 'https://placehold.co/600x400.png', dataAiHint: 'office teamwork' },
  { id: '3', title: 'Product X Launch Event', description: 'The official launch event for our new Product X.', thumbnailUrl: 'https://placehold.co/600x400.png', dataAiHint: 'product launch' },
  { id: '4', title: 'Advanced Security Training', description: 'Mandatory security training for all engineering staff.', thumbnailUrl: 'https://placehold.co/600x400.png', dataAiHint: 'cyber security' },
  { id: '5', title: 'Marketing Strategy 2024', description: 'Deep dive into the marketing strategies for the upcoming year.', thumbnailUrl: 'https://placehold.co/600x400.png', dataAiHint: 'marketing strategy' },
  { id: '6', title: 'Team Building Workshop', description: 'Highlights from the annual team building workshop.', thumbnailUrl: 'https://placehold.co/600x400.png', dataAiHint: 'team building' }
];

export type Video = typeof mockVideos[0] & { summary?: string };

export function VideoCatalog() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const videoTitles = mockVideos.map(v => v.title);
        const videoDescriptions = mockVideos.map(v => v.description);
        
        const result: VideoSummaryOutput = await summarizeVideos({ videoTitles, videoDescriptions });
        
        const videosWithSummaries = mockVideos.map((video, index) => ({
          ...video,
          summary: result.summaries[index] || 'No summary available.',
        }));
        
        setVideos(videosWithSummaries);
      } catch (error) {
        console.error('Failed to get video summaries:', error);
        // Set videos with a fallback summary on error
        const videosWithFallback = mockVideos.map(video => ({
          ...video,
          summary: video.description,
        }));
        setVideos(videosWithFallback);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummaries();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
