import { VideoPlayer } from '@/components/video-player';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// In a real app, you would fetch video details by ID from a server.
const mockVideos = [
  { id: '1', title: 'Company All-Hands Q1', src: '/placeholder-video.mp4' },
  { id: '2', title: 'New Employee Onboarding', src: '/placeholder-video.mp4' },
  { id: '3', title: 'Product X Launch Event', src: '/placeholder-video.mp4' },
  { id: '4', title: 'Advanced Security Training', src: '/placeholder-video.mp4' },
  { id: '5', title: 'Marketing Strategy 2024', src: '/placeholder-video.mp4' },
  { id: '6', title: 'Team Building Workshop', src: '/placeholder-video.mp4' }
];

export default function WatchPage({ params }: { params: { id: string } }) {
  const video = mockVideos.find(v => v.id === params.id) || mockVideos[0];

  return (
    <div className="flex flex-col h-screen bg-black">
      <header className="flex-shrink-0 p-4 bg-gray-900/50 text-white flex items-center justify-between z-10">
        <Button asChild variant="ghost" className="hover:bg-white/10">
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Catalog
            </Link>
        </Button>
        <h1 className="text-xl font-bold truncate font-headline">{video.title}</h1>
        <div className="w-24"></div>
      </header>
      <main className="flex-1 flex items-center justify-center overflow-hidden">
        <VideoPlayer videoSrc={video.src} />
      </main>
    </div>
  );
}
