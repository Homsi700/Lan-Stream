
"use client";
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlayCircle, Film } from 'lucide-react';
import type { Video } from '@/app/dashboard/video-catalog';
import { useTranslation } from '@/hooks/use-translation';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <div className="p-2 bg-primary/10 rounded-lg mt-1">
            <Film className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg font-bold">{video.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-4 pb-4 -mt-2">
        <p className="text-sm text-muted-foreground line-clamp-4">
          {video.summary || video.title}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 bg-secondary/30">
        <Button asChild className="w-full">
          <Link href={`/dashboard/watch/${video.id}`}>
            <PlayCircle className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
            {t('videoCard.watchNow')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function VideoCardSkeleton() {
  return (
    <Card className="flex flex-col">
       <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
