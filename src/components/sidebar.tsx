
"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Clapperboard, Home, LogOut, Moon, Sun, Languages, Users, Settings, CalendarClock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from './ui/separator';
import { useTranslation } from '@/hooks/use-translation';
import { useAppContext } from '@/context/app-context';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

interface UserProfile {
    name: string;
    email: string;
    expiresAt?: string | null;
    avatar: string;
    avatarFallback: string;
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useAppContext();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
     const role = localStorage.getItem('user_role');
     if (role === 'admin') {
         setUserProfile({
            name: t('sidebar.adminUser.name'),
            email: t('sidebar.adminUser.email'),
            avatar: 'https://placehold.co/100x100.png',
            avatarFallback: 'A'
         });
     } else if (role === 'user') {
         const username = localStorage.getItem('user_username');
         const expiresAt = localStorage.getItem('user_expires_at');
         setUserProfile({
            name: username || t('sidebar.clientUser.name'),
            email: `${username || 'client'}@avatv.local`,
            expiresAt: expiresAt,
            avatar: 'https://placehold.co/100x100.png',
            avatarFallback: username ? username.charAt(0).toUpperCase() : 'C'
         });
     }
  }, [language]);

  const handleLogout = async () => {
    const username = localStorage.getItem("user_username");
    try {
        await fetch('/api/sessions', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });
    } catch (error) {
        console.error("Failed to clear session on logout:", error);
    } finally {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_username');
        localStorage.removeItem('user_expires_at');
        router.push('/');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  if (!userProfile) {
    return null; // or a loading skeleton
  }
  
  const dashboardHref = localStorage.getItem('user_role') === 'admin' ? '/dashboard' : '/dashboard/client';

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground p-2 rounded-lg">
             <Clapperboard className="h-6 w-6 text-primary" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground font-headline">{t('appName')}</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={dashboardHref} passHref>
              <SidebarMenuButton 
                isActive={pathname === dashboardHref || (localStorage.getItem('user_role') === 'user' && pathname === '/dashboard')}
                tooltip={t('sidebar.dashboard')}
                asChild
              >
                <div>
                  <Home />
                  <span>{t('sidebar.dashboard')}</span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          {localStorage.getItem('user_role') === 'admin' && (
            <>
              <SidebarMenuItem>
                <Link href="/dashboard/user-management" passHref>
                  <SidebarMenuButton 
                    isActive={pathname.startsWith('/dashboard/user-management')}
                    tooltip={t('sidebar.userManagement')}
                     asChild
                  >
                    <div>
                      <Users />
                      <span>{t('sidebar.userManagement')}</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="/dashboard/settings" passHref>
                  <SidebarMenuButton 
                    isActive={pathname.startsWith('/dashboard/settings')}
                    tooltip={t('sidebar.settings')}
                     asChild
                  >
                    <div>
                      <Settings />
                      <span>{t('sidebar.settings')}</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <div className="flex items-center gap-2 p-2">
           <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full justify-center">
             {theme === 'light' ? <Moon /> : <Sun />}
             <span className="sr-only">{t('sidebar.toggleTheme')}</span>
           </Button>
            <Button variant="ghost" size="icon" onClick={toggleLanguage} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full justify-center">
             <Languages />
             <span className="sr-only">{t('sidebar.toggleLanguage')}</span>
           </Button>
         </div>

        <Separator className="my-2 bg-sidebar-border" />
         <div className="flex items-center gap-3 p-2">
            <Avatar className="h-9 w-9">
                <AvatarImage src={userProfile.avatar} alt="@user" data-ai-hint="user avatar" />
                <AvatarFallback>{userProfile.avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
                <p className="font-semibold truncate">{userProfile.name}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{userProfile.email}</p>
            </div>
        </div>

        {userProfile.expiresAt && (
            <div className="px-3 pb-2 text-xs text-sidebar-foreground/70 flex items-center gap-2">
                <CalendarClock className="h-3 w-3" />
                <span>
                    {t('userManagement.table.expiresOn')}: {new Date(userProfile.expiresAt).toLocaleDateString(language)}
                </span>
            </div>
        )}

        <SidebarMenuButton onClick={handleLogout} variant="default" className="bg-sidebar-accent/50 hover:bg-sidebar-accent">
          <LogOut />
          <span>{t('sidebar.logout')}</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
