
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlayCircle } from 'lucide-react';
import type { Video } from '@/app/dashboard/video-catalog';
import { useTranslation } from '@/hooks/use-translation';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/dashboard/watch/${video.id}`} className="block relative group">
          <Image
            src={video.thumbnailUrl}
            alt={`Thumbnail for ${video.title}`}
            width={600}
            height={400}
            className="aspect-video w-full object-cover"
            data-ai-hint={video.dataAiHint}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <PlayCircle className="h-16 w-16 text-white" />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="text-lg font-bold line-clamp-2 h-[3.25rem]">{video.title}</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3 h-[3.75rem]">
          {video.summary}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/dashboard/watch/${video.id}`}>{t('videoCard.watchNow')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function VideoCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="flex-1 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
