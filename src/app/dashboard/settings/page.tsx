
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Loader2, Link, Upload } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VideoContent {
  id: number;
  title: string;
  link: string;
}

export default function SettingsPage() {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoLink, setNewVideoLink] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('/api/videos');
        const data = await response.json();
        setVideos(data);
    } catch(error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch videos.' });
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideoByLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle || !newVideoLink) {
      toast({ variant: 'destructive', title: t('toast.formError.title'), description: t('toast.formError.description') });
      return;
    }

    const newVideo: Omit<VideoContent, 'id'> & { id?: number } = {
      id: Date.now(),
      title: newVideoTitle,
      link: newVideoLink,
    };
    
    try {
      await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideo),
      });
      await fetchVideos();
      setNewVideoTitle('');
      setNewVideoLink('');
      toast({ title: t('settings.toast.videoAdded.title'), description: t('settings.toast.videoAdded.description') });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add video.' });
    }
  };

  const handleAddVideoByUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadFile) {
        toast({ variant: 'destructive', title: t('toast.formError.title'), description: t('toast.formError.description') });
        return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('title', uploadTitle);
    formData.append('video', uploadFile);

    try {
        const response = await fetch('/api/videos/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Upload failed');
        }

        await fetchVideos();
        setUploadTitle('');
        setUploadFile(null);
        // Reset file input
        const fileInput = document.getElementById('upload-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';

        toast({ title: t('settings.toast.videoAdded.title'), description: t('settings.toast.videoAdded.description') });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Upload Error', description: error.message || 'Failed to upload video.' });
    } finally {
        setIsUploading(false);
    }
  };

  const handleRemoveVideo = async (id: number) => {
    try {
        await fetch(`/api/videos/${id}`, { method: 'DELETE' });
        await fetchVideos();
        toast({ title: t('toast.userRemoved.title'), description: t('toast.userRemoved.description')});
    } catch(error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove video.' });
    }
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
            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="link"><Link className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t('settings.addByLink')}</TabsTrigger>
                <TabsTrigger value="upload"><Upload className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t('settings.addByUpload')}</TabsTrigger>
              </TabsList>
              <TabsContent value="link" className="mt-6">
                <form onSubmit={handleAddVideoByLink} className="grid md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="new-video-title">{t('settings.newVideo.videoTitleLabel')}</Label>
                    <Input
                      id="new-video-title"
                      placeholder={t('settings.newVideo.videoTitlePlaceholder')}
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                    />
                  </div>
                   <div className="space-y-2  md:col-span-3">
                    <Label htmlFor="new-video-link">{t('settings.newVideo.videoLinkLabel')}</Label>
                    <Input
                      id="new-video-link"
                      placeholder={t('settings.newVideo.videoLinkPlaceholder')}
                      value={newVideoLink}
                      onChange={(e) => setNewVideoLink(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full md:col-start-3">
                    <PlusCircle className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t('settings.newVideo.addVideo')}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="upload" className="mt-6">
                <form onSubmit={handleAddVideoByUpload} className="grid md:grid-cols-3 gap-4 items-end">
                   <div className="space-y-2">
                    <Label htmlFor="upload-title">{t('settings.newVideo.videoTitleLabel')}</Label>
                    <Input
                      id="upload-title"
                      placeholder={t('settings.newVideo.videoTitlePlaceholder')}
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                       disabled={isUploading}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="upload-file">{t('settings.upload.fileLabel')}</Label>
                    <Input
                      id="upload-file"
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                       disabled={isUploading}
                    />
                  </div>
                  <Button type="submit" className="w-full md:col-span-3" disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="ltr:mr-2 rtl:ml-2 h-4 w-4 animate-spin" />
                        {t('settings.upload.uploading')}
                      </>
                    ) : (
                      <>
                        <Upload className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                        {t('settings.upload.uploadAndAdd')}
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
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
                       {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                                </TableCell>
                            </TableRow>
                        ) : videos.length > 0 ? (
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
