
"use client";

import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Clapperboard, Home, LogOut, Moon, Sun, Languages, Users, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from './ui/separator';
import { useTranslation } from '@/hooks/use-translation';
import { useAppContext } from '@/context/app-context';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useAppContext();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
     setUserRole(localStorage.getItem('user_role'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    router.push('/');
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

  const user = userRole === 'admin' ? {
      name: t('sidebar.adminUser.name'),
      email: t('sidebar.adminUser.email'),
      avatar: 'https://placehold.co/100x100.png',
      avatarFallback: 'A'
  } : {
      name: t('sidebar.clientUser.name'),
      email: t('sidebar.clientUser.email'),
      avatar: 'https://placehold.co/100x100.png',
      avatarFallback: 'C'
  };
  
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
            <SidebarMenuButton 
              href={userRole === 'admin' ? '/dashboard' : '/dashboard/client'}
              isActive={pathname === '/dashboard' || pathname === '/dashboard/client'} 
              tooltip={t('sidebar.dashboard')}
            >
              <Home />
              <span>{t('sidebar.dashboard')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {userRole === 'admin' && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  href="/dashboard/user-management"
                  isActive={pathname.startsWith('/dashboard/user-management')}
                  tooltip={t('sidebar.userManagement')}
                >
                  <Users />
                  <span>{t('sidebar.userManagement')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  href="/dashboard/settings"
                  isActive={pathname.startsWith('/dashboard/settings')}
                  tooltip={t('sidebar.settings')}
                >
                  <Settings />
                  <span>{t('sidebar.settings')}</span>
                </SidebarMenuButton>
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
                <AvatarImage src={user.avatar} alt="@user" data-ai-hint="user avatar" />
                <AvatarFallback>{user.avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
                <p className="font-semibold truncate">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{user.email}</p>
            </div>
        </div>
        <SidebarMenuButton onClick={handleLogout} variant="default" className="bg-sidebar-accent/50 hover:bg-sidebar-accent">
          <LogOut />
          <span>{t('sidebar.logout')}</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
