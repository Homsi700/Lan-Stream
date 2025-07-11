
"use client";
import { useState, useEffect } from 'react';
import { VideoCatalog } from './video-catalog';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserX, Loader2, Clock, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

const RECENTLY_ACTIVE_MINUTES = 5;

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<{ active: number; inactive: number; expired: number } | null>(null);
  const [recentlyActiveUsers, setRecentlyActiveUsers] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const users: User[] = await response.json();
        
        let activeUsers = 0;
        let inactiveUsers = 0;
        let expiredUsers = 0;

        const clientUsers = users.filter(u => u.username !== 'admin');

        clientUsers.forEach(u => {
            const isExpired = u.expiresAt && new Date(u.expiresAt) < new Date();
            if (isExpired) {
                expiredUsers++;
            } else if (u.status === 'active') {
                activeUsers++;
            } else {
                inactiveUsers++;
            }
        });

        setStats({ active: activeUsers, inactive: inactiveUsers, expired: expiredUsers });
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
          <Card>
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
          <Card>
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
          <Card>
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
           <Card>
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
    </div>
  );
}
