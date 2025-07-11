"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Loader2, Link, Upload, Cog, Signal, Pencil } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from 'axios';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

interface VideoContent {
  id: number;
  title: string;
  link?: string;
  type: 'link' | 'upload' | 'ipcam' | 'webrtc';
  signalingUrl?: string;
  username?: string;
  password?: string;
  processing?: boolean;
  thumbnail?: string;
  summary?: string;
}

export default function SettingsPage() {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Link states
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoLink, setNewVideoLink] = useState('');
  
  // Upload states
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // WebRTC states
  const [webrtcTitle, setWebrtcTitle] = useState('');
  const [webrtcUrl, setWebrtcUrl] = useState('');
  const [webrtcUsername, setWebrtcUsername] = useState('');
  const [webrtcPassword, setWebrtcPassword] = useState('');
  const [showWebRTCPassword, setShowWebRTCPassword] = useState(false);

  // Edit states
  const [editingVideo, setEditingVideo] = useState<VideoContent | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchVideos = async () => {
    try {
        const response = await fetch('/api/videos');
        const data = await response.json();
        setVideos(data);
    } catch(error) {
        if (isLoading) {
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch videos.' });
        }
    } finally {
        if (isLoading) {
          setIsLoading(false);
        }
    }
  }

  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddVideo = async (videoData: Partial<VideoContent>) => {
    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Date.now(), thumbnail: `https://placehold.co/600x400.png`, ...videoData }),
      });
       if (!response.ok) {
         throw new Error('Failed to add video');
       }
      await fetchVideos();
      toast({ title: t('settings.toast.videoAdded.title'), description: t('settings.toast.videoAdded.description') });
      return true;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add video.' });
      return false;
    }
  };

  const handleAddVideoByLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle || !newVideoLink) {
      toast({ variant: 'destructive', title: t('toast.formError.title'), description: t('toast.formError.description') });
      return;
    }
    const isIpCam = /^https?:\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})\b.*/.test(newVideoLink);

    const success = await handleAddVideo({
      title: newVideoTitle,
      link: newVideoLink,
      type: isIpCam ? 'ipcam' : 'link',
    });

    if (success) {
      setNewVideoTitle('');
      setNewVideoLink('');
    }
  };

  const handleAddVideoByWebRTC = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webrtcTitle || !webrtcUrl) {
      toast({ variant: 'destructive', title: t('toast.formError.title'), description: 'Please provide a title and signaling URL.' });
      return;
    }
    
    const success = await handleAddVideo({
      title: webrtcTitle,
      signalingUrl: webrtcUrl,
      username: webrtcUsername,
      password: webrtcPassword,
      type: 'webrtc',
    });
    
    if (success) {
      setWebrtcTitle('');
      setWebrtcUrl('');
      setWebrtcUsername('');
      setWebrtcPassword('');
    }
  };

  const handleAddVideoByUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadFile) {
        toast({ variant: 'destructive', title: t('toast.formError.title'), description: t('toast.formError.description') });
        return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('title', uploadTitle);
    formData.append('video', uploadFile);

    try {
        const response = await axios.post('/api/videos/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data', },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                  setUploadProgress(percentCompleted);
                }
            },
        });

        if (response.status !== 201) { throw new Error(response.data.message || 'Upload failed'); }
        await fetchVideos();
        setUploadTitle('');
        setUploadFile(null);
        const fileInput = document.getElementById('upload-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        toast({ title: t('settings.toast.videoAdded.title'), description: "Video is now processing in the background." });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Upload Error', description: error.response?.data?.message || error.message || 'Failed to upload video.' });
    } finally {
        setIsUploading(false);
        setUploadProgress(0);
    }
  };

  const handleRemoveVideo = async (id: number) => {
    try {
        const response = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
        if (!response.ok) { throw new Error('Failed to delete video'); }
        await fetchVideos();
        toast({ title: t('toast.userRemoved.title'), description: t('toast.userRemoved.description')});
    } catch(error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove video.' });
    }
  };

  const handleEditVideo = (video: VideoContent) => {
    setEditingVideo({...video});
    setIsEditDialogOpen(true);
  }

  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;

    try {
      const response = await fetch(`/api/videos/${editingVideo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingVideo),
      });

      if (!response.ok) { throw new Error('Failed to update video'); }
      
      await fetchVideos();
      setIsEditDialogOpen(false);
      setEditingVideo(null);
      toast({ title: t('settings.toast.videoUpdated.title'), description: t('settings.toast.videoUpdated.description') });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update video.' });
    }
  };

  const getVideoSourceInfo = (video: VideoContent) => {
    if (video.processing) {
      return (
        <div className="flex items-center gap-2 text-amber-500">
            <Cog className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
        </div>
      );
    }
    switch (video.type) {
        case 'upload':
        case 'link':
        case 'ipcam':
            return video.link;
        case 'webrtc':
            return video.signalingUrl;
        default:
            return 'N/A';
    }
  };

  const renderEditForm = () => {
    if (!editingVideo) return null;

    return (
        <form onSubmit={handleUpdateVideo} className="space-y-4">
            <div>
                <Label htmlFor="edit-video-title">{t('settings.newVideo.videoTitleLabel')}</Label>
                <Input
                    id="edit-video-title"
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({...editingVideo, title: e.target.value})}
                />
            </div>
             <div>
                <Label htmlFor="edit-video-thumbnail">{t('settings.editVideo.thumbnailUrl')}</Label>
                <Input
                    id="edit-video-thumbnail"
                    placeholder="https://example.com/image.png"
                    value={editingVideo.thumbnail?.includes('placehold.co') ? '' : editingVideo.thumbnail}
                    onChange={(e) => setEditingVideo({...editingVideo, thumbnail: e.target.value})}
                />
            </div>
            { (editingVideo.type === 'link' || editingVideo.type === 'ipcam') && (
                <div>
                    <Label htmlFor="edit-video-link">{t('settings.newVideo.videoLinkLabel')}</Label>
                    <Input
                        id="edit-video-link"
                        value={editingVideo.link || ''}
                        onChange={(e) => setEditingVideo({...editingVideo, link: e.target.value})}
                    />
                </div>
            )}
            { editingVideo.type === 'webrtc' && (
                <>
                  <div>
                      <Label htmlFor="edit-webrtc-url">Signaling Server URL</Label>
                      <Input
                          id="edit-webrtc-url"
                          value={editingVideo.signalingUrl || ''}
                          onChange={(e) => setEditingVideo({...editingVideo, signalingUrl: e.target.value})}
                      />
                  </div>
                  <div>
                    <Label htmlFor="edit-webrtc-username">Username (Optional)</Label>
                    <Input 
                      id="edit-webrtc-username"
                      value={editingVideo.username || ''}
                      onChange={(e) => setEditingVideo({...editingVideo, username: e.target.value})}
                    />
                  </div>
                   <div>
                    <Label htmlFor="edit-webrtc-password">Password (Optional)</Label>
                    <Input
                      id="edit-webrtc-password"
                      value={editingVideo.password || ''}
                      onChange={(e) => setEditingVideo({...editingVideo, password: e.target.value})}
                    />
                  </div>
                </>
            )}
            <div>
              <Label htmlFor="edit-video-summary">{t('videoCard.summary')}</Label>
              <Textarea
                id="edit-video-summary"
                placeholder={t('videoCard.summaryPlaceholder')}
                value={editingVideo.summary || ''}
                onChange={(e) => setEditingVideo({...editingVideo, summary: e.target.value})}
              />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">{t('cancel')}</Button>
                </DialogClose>
                <Button type="submit">{t('saveChanges')}</Button>
            </DialogFooter>
        </form>
    );
  }

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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="link"><Link className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t('settings.addByLink')}</TabsTrigger>
                <TabsTrigger value="upload"><Upload className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t('settings.addByUpload')}</TabsTrigger>
                <TabsTrigger value="webrtc"><Signal className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> WebRTC</TabsTrigger>
              </TabsList>

              <TabsContent value="link" className="mt-6">
                <form onSubmit={handleAddVideoByLink} className="space-y-4">
                  <div>
                    <Label htmlFor="new-video-title">{t('settings.newVideo.videoTitleLabel')}</Label>
                    <Input
                      id="new-video-title"
                      placeholder={t('settings.newVideo.videoTitlePlaceholder')}
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                    />
                  </div>
                   <div>
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
              </TabsContent>

              <TabsContent value="upload" className="mt-6">
                <form onSubmit={handleAddVideoByUpload} className="space-y-4">
                   <div>
                    <Label htmlFor="upload-title">{t('settings.newVideo.videoTitleLabel')}</Label>
                    <Input
                      id="upload-title"
                      placeholder={t('settings.newVideo.videoTitlePlaceholder')}
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                       disabled={isUploading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="upload-file">{t('settings.upload.fileLabel')}</Label>
                    <Input
                      id="upload-file"
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-matroska,video/x-msvideo"
                      onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                       disabled={isUploading}
                    />
                  </div>
                  {isUploading && (
                    <div className="w-full space-y-2">
                      <div className="flex justify-between">
                         <p className="text-sm text-muted-foreground">{uploadProgress < 100 ? t('settings.upload.uploading') : 'Processing...'}</p>
                         <p className="text-sm font-medium">{uploadProgress}%</p>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isUploading || !uploadFile || !uploadTitle}>
                    {isUploading ? (
                      <><Loader2 className="ltr:mr-2 rtl:ml-2 h-4 w-4 animate-spin" />{uploadProgress < 100 ? t('settings.upload.uploading') : 'Processing...'}</>
                    ) : (
                      <><Upload className="ltr:mr-2 rtl:ml-2 h-4 w-4" />{t('settings.upload.uploadAndAdd')}</>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="webrtc" className="mt-6">
                <form onSubmit={handleAddVideoByWebRTC} className="space-y-4">
                  <div>
                    <Label htmlFor="webrtc-title">{t('settings.newVideo.videoTitleLabel')}</Label>
                    <Input id="webrtc-title" placeholder="e.g., Office Cam" value={webrtcTitle} onChange={(e) => setWebrtcTitle(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="webrtc-url">Signaling Server URL</Label>
                    <Input id="webrtc-url" placeholder="wss://your-server.com/signal" value={webrtcUrl} onChange={(e) => setWebrtcUrl(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="webrtc-username">Username (Optional)</Label>
                    <Input id="webrtc-username" placeholder="Enter username" value={webrtcUsername} onChange={(e) => setWebrtcUsername(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="webrtc-password">Password (Optional)</Label>
                    <Input id="webrtc-password" type={showWebRTCPassword ? 'text' : 'password'} placeholder="Enter password" value={webrtcPassword} onChange={(e) => setWebrtcPassword(e.target.value)} />
                  </div>
                   <Button type="submit" className="w-full">
                    <PlusCircle className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> Add WebRTC Stream
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
                        <TableHead>Source</TableHead>
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
                            <TableCell className="font-mono text-muted-foreground truncate max-w-xs">
                              {getVideoSourceInfo(video)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleEditVideo(video)} aria-label={t('edit')}>
                                <Pencil className="h-4 w-4 text-primary" />
                              </Button>
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t('settings.editVideo.title')}</DialogTitle>
            </DialogHeader>
            {renderEditForm()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
