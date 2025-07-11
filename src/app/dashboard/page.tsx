
"use client";
import { useState, useEffect } from 'react';
import { VideoCatalog } from './video-catalog';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserX, Loader2, Clock, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface User {
  id: number;
  username: string;
  status: 'active' | 'inactive';
  expiresAt: string | null;
}

interface Session {
    username: string;
    loggedInAt: string;
}

interface DialogData {
    title: string;
    users: { username: string }[];
}

const RECENTLY_ACTIVE_MINUTES = 5;

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<{ active: number; inactive: number; expired: number } | null>(null);
  const [userLists, setUserLists] = useState<{ active: User[]; inactive: User[]; expired: User[] }>({ active: [], inactive: [], expired: [] });
  const [recentlyActiveUsers, setRecentlyActiveUsers] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<DialogData | null>(null);

  const handleCardClick = (title: string, users: { username: string }[]) => {
    setDialogData({ title, users });
    setIsDialogOpen(true);
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const users: User[] = await response.json();
        
        const lists = { active: [] as User[], inactive: [] as User[], expired: [] as User[] };
        const clientUsers = users.filter(u => u.username !== 'admin');

        clientUsers.forEach(u => {
            const isExpired = u.expiresAt && new Date(u.expiresAt) < new Date();
            if (isExpired) {
                lists.expired.push(u);
            } else if (u.status === 'active') {
                lists.active.push(u);
            } else {
                lists.inactive.push(u);
            }
        });
        
        setUserLists(lists);
        setStats({ active: lists.active.length, inactive: lists.inactive.length, expired: lists.expired.length });

      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
        try {
            const response = await fetch('/api/sessions');
            const sessions: Session[] = await response.json();
            const now = new Date();
            const cutoff = new Date(now.getTime() - RECENTLY_ACTIVE_MINUTES * 60 * 1000);

            const active = sessions.filter(s => new Date(s.loggedInAt) > cutoff);
            setRecentlyActiveUsers(active);
        } catch (error) {
            console.error("Failed to fetch sessions:", error);
        }
    }
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [])


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">{t('dashboard.title')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('dashboard.subtitle')}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleCardClick(t('dashboard.stats.recentlyActive'), recentlyActiveUsers)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.stats.recentlyActive')}
              </CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <>
                    <div className="text-2xl font-bold">{recentlyActiveUsers.length}</div>
                    <div className="text-xs text-muted-foreground space-x-1 rtl:space-x-reverse truncate">
                        {recentlyActiveUsers.map(u => (
                            <Badge variant="outline" key={u.username} className="font-mono">{u.username}</Badge>
                        ))}
                    </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleCardClick(`${t('userManagement.status.active')} ${t('sidebar.userManagement')}`, userLists.active)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('userManagement.status.active')} {t('sidebar.userManagement')}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <div className="text-2xl font-bold">{stats?.active}</div>
              )}
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleCardClick(`${t('userManagement.status.inactive')} ${t('sidebar.userManagement')}`, userLists.inactive)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('userManagement.status.inactive')} {t('sidebar.userManagement')}
              </CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <div className="text-2xl font-bold">{stats?.inactive}</div>
              )}
            </CardContent>
          </Card>
           <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleCardClick(`${t('userManagement.status.expired')} ${t('sidebar.userManagement')}`, userLists.expired)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('userManagement.status.expired')} {t('sidebar.userManagement')}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <div className="text-2xl font-bold">{stats?.expired}</div>
              )}
            </CardContent>
          </Card>
      </div>
      
      <VideoCatalog />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{dialogData?.title}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-72 w-full rounded-md border p-4">
                {dialogData && dialogData.users.length > 0 ? (
                    <ul className="space-y-2">
                        {dialogData.users.map((user, index) => (
                            <li key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                <span className="font-mono text-sm">{user.username}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        {t('dashboard.stats.noUsers')}
                    </div>
                )}
            </ScrollArea>
          </DialogContent>
      </Dialog>
    </div>
  );
}

    