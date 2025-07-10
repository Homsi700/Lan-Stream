
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface VideoContent {
  id: number;
  title: string;
  link: string;
}

const VIDEOS_STORAGE_KEY = 'lan_stream_videos';

export default function SettingsPage() {
  const [videos, setVideos] = useLocalStorage<VideoContent[]>(VIDEOS_STORAGE_KEY, []);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoLink, setNewVideoLink] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle || !newVideoLink) {
      toast({ variant: 'destructive', title: t('toast.formError.title'), description: t('toast.formError.description') });
      return;
    }

    const newVideo: VideoContent = {
      id: Date.now(),
      title: newVideoTitle,
      link: newVideoLink,
    };
    
    setVideos([...videos, newVideo]);
    setNewVideoTitle('');
    setNewVideoLink('');
    toast({ title: t('settings.toast.videoAdded.title'), description: t('settings.toast.videoAdded.description') });
  };

  const handleRemoveVideo = (id: number) => {
    const updatedVideos = videos.filter(video => video.id !== id);
    setVideos(updatedVideos);
    toast({ title: t('toast.userRemoved.title'), description: t('toast.userRemoved.description')});
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">{t('settings.title')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
            {t('settings.subtitle')}
        </p>
      </header>
      <div className="grid gap-8 max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('settings.newVideo.title')}</CardTitle>
            <CardDescription>{t('settings.newVideo.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddVideo} className="grid md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="new-video-title">{t('settings.newVideo.videoTitleLabel')}</Label>
                <Input
                  id="new-video-title"
                  placeholder={t('settings.newVideo.videoTitlePlaceholder')}
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-video-link">{t('settings.newVideo.videoLinkLabel')}</Label>
                <Input
                  id="new-video-link"
                  placeholder={t('settings.newVideo.videoLinkPlaceholder')}
                  value={newVideoLink}
                  onChange={(e) => setNewVideoLink(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                <PlusCircle className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t('settings.newVideo.addVideo')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>{t('settings.videoList.title')}</CardTitle>
                <CardDescription>{t('settings.videoList.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('settings.newVideo.videoTitleLabel')}</TableHead>
                        <TableHead>{t('settings.newVideo.videoLinkLabel')}</TableHead>
                        <TableHead className="text-right">{t('userManagement.table.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {videos.length > 0 ? (
                        videos.map(video => (
                          <TableRow key={video.id}>
                            <TableCell className="font-medium">{video.title}</TableCell>
                            <TableCell className="font-mono text-muted-foreground">{video.link}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveVideo(video.id)} aria-label={t('remove')}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                                {t('settings.videoList.noVideos')}
                            </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
