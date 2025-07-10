
"use client";
import { VideoPlayer } from '@/components/video-player';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';

// In a real app, you would fetch video details by ID from a server.
const mockVideos = [
  { id: '1', title: 'Company All-Hands Q1', title_ar: 'اجتماع الشركة الربع الأول', src: '/placeholder-video.mp4' },
  { id: '2', title: 'New Employee Onboarding', title_ar: 'تأهيل الموظفين الجدد', src: '/placeholder-video.mp4' },
  { id: '3', title: 'Product X Launch Event', title_ar: 'حدث إطلاق المنتج X', src: '/placeholder-video.mp4' },
  { id: '4', title: 'Advanced Security Training', title_ar: 'تدريب أمني متقدم', src: '/placeholder-video.mp4' },
  { id: '5', title: 'Marketing Strategy 2024', title_ar: 'استراتيجية التسويق 2024', src: '/placeholder-video.mp4' },
  { id: '6', title: 'Team Building Workshop', title_ar: 'ورشة عمل بناء الفريق', src: '/placeholder-video.mp4' }
];

export default function WatchPage({ params }: { params: { id: string } }) {
  const { t, language } = useTranslation();
  const video = mockVideos.find(v => v.id === params.id) || mockVideos[0];
  const videoTitle = language === 'ar' ? video.title_ar : video.title;

  return (
    <div className="flex flex-col h-screen bg-black">
      <header className="flex-shrink-0 p-4 bg-gray-900/50 text-white flex items-center justify-between z-10">
        <Button asChild variant="ghost" className="hover:bg-white/10">
            <Link href="/dashboard">
                <ArrowLeft className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                {t('watch.backToCatalog')}
            </Link>
        </Button>
        <h1 className="text-xl font-bold truncate font-headline">{videoTitle}</h1>
        <div className="w-24"></div>
      </header>
      <main className="flex-1 flex items-center justify-center overflow-hidden">
        <VideoPlayer videoSrc={video.src} />
      </main>
    </div>
  );
}
