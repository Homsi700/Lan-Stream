
"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { VideoPlayer } from '@/components/video-player';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Film } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';

interface Video {
  id: number;
  title: string;
  link: string;
}

const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        return null;
    }
    let videoId = null;
    if (url.includes('watch?v=')) {
        videoId = new URL(url).searchParams.get('v');
    } else if (url.includes('youtu.be/')) {
        videoId = new URL(url).pathname.split('/')[1];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
}

export default function WatchPage() {
  const params = useParams();
  const { t } = useTranslation();
  const [video, setVideo] = useState<Video | null>(null);
  const [backLink, setBackLink] = useState('/dashboard');

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    setBackLink(role === 'admin' ? '/dashboard' : '/dashboard/client');

    const videoId = typeof params.id === 'string' ? params.id : '';
    if (videoId) {
        const fetchVideos = async () => {
            try {
                const response = await fetch('/api/videos');
                const storedVideos: Video[] = await response.json();
                const foundVideo = storedVideos.find(v => v.id.toString() === videoId);
                setVideo(foundVideo || null);
            } catch (error) {
                console.error("Failed to fetch video details", error);
                setVideo(null);
            }
        };
        fetchVideos();
    }
  }, [params.id]);

  const youtubeEmbedUrl = video ? getYouTubeEmbedUrl(video.link) : null;
  
  if (!video) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
          <Film className="h-16 w-16 text-primary animate-pulse" />
          <p className="text-muted-foreground">{t('watch.loadingVideo')}</p>
          <Button asChild variant="outline">
            <Link href={backLink}>
                {t('watch.backToCatalog')}
            </Link>
        </Button>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <header className="flex-shrink-0 p-4 bg-gray-900/50 text-white flex items-center justify-between z-10">
        <Button asChild variant="ghost" className="hover:bg-white/10">
            <Link href={backLink}>
                <ArrowLeft className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                {t('watch.backToCatalog')}
            </Link>
        </Button>
        <h1 className="text-xl font-bold truncate font-headline">{video.title}</h1>
        <div className="w-24"></div>
      </header>
      <main className="flex-1 flex items-center justify-center overflow-hidden">
        {youtubeEmbedUrl ? (
             <iframe
                className="w-full max-w-6xl aspect-video rounded-lg shadow-2xl shadow-primary/20"
                src={youtubeEmbedUrl}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>
        ) : (
            <VideoPlayer videoSrc={video.link} />
        )}
      </main>
    </div>
  );
}

