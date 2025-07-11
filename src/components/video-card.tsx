
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlayCircle, Cog } from 'lucide-react';
import type { Video } from '@/app/dashboard/video-catalog';
import { useTranslation } from '@/hooks/use-translation';
import { Badge } from '@/components/ui/badge';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1 group">
      <div className="relative">
        <Link href={`/dashboard/watch/${video.id}`} className="block">
          <div className="aspect-video overflow-hidden">
            <Image
              src={video.thumbnail || 'https://placehold.co/600x400.png'}
              alt={video.title}
              width={600}
              height={400}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              data-ai-hint="video thumbnail"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </Link>
        {video.processing && (
          <Badge variant="destructive" className="absolute top-2 right-2 animate-pulse">
            <Cog className="h-3 w-3 ltr:mr-1 rtl:ml-1 animate-spin" />
            Processing
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <CardTitle className="text-lg font-bold text-white line-clamp-2 leading-tight">
            <Link href={`/dashboard/watch/${video.id}`} className="hover:underline">
              {video.title}
            </Link>
          </CardTitle>
        </div>
      </div>
      <CardFooter className="p-4 bg-secondary/30">
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
    <Card className="flex flex-col overflow-hidden">
       <Skeleton className="w-full aspect-video" />
       <div className="p-4 flex-1">
         <Skeleton className="h-5 w-3/4 mb-2" />
         <Skeleton className="h-4 w-full" />
       </div>
      <CardFooter className="p-4">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
