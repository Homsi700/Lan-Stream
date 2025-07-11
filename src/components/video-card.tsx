"use client";
import Link from 'next/link';
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
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary line-clamp-2 leading-tight">
            {video.title}
        </CardTitle>
        {video.processing && (
          <Badge variant="destructive" className="absolute top-2 right-2 animate-pulse z-10">
            <Cog className="h-3 w-3 ltr:mr-1 rtl:ml-1 animate-spin" />
            Processing
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
      <CardFooter className="p-4 bg-secondary/30 mt-auto">
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
       <CardHeader>
         <Skeleton className="h-5 w-3/4" />
       </CardHeader>
       <CardContent className="flex-grow"></CardContent>
      <CardFooter className="p-4">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
