
"use client";
import { useState, useEffect } from 'react';
import { VideoCatalog } from './video-catalog';
import { useTranslation } from '@/hooks/use-translation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserX, Loader2, Clock } from 'lucide-react';

interface User {
  id: number;
  username: string;
  status: 'active' | 'inactive';
  expiresAt: string | null;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<{ active: number; inactive: number; expired: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const users: User[] = await response.json();
        
        let activeUsers = 0;
        let inactiveUsers = 0;
        let expiredUsers = 0;

        users.forEach(u => {
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
