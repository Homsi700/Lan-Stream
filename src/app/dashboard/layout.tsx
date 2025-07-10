
"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar';
import { Clapperboard } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useAppContext } from '@/context/app-context';


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const { t } = useTranslation();
  const { language, theme } = useAppContext();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) {
      router.replace('/');
      return;
    }
    
    const role = localStorage.getItem('user_role');
    // If a normal user tries to access admin pages, redirect them
    if (role === 'user' && (pathname === '/dashboard' || pathname.startsWith('/dashboard/user-management') || pathname.startsWith('/dashboard/settings'))) {
        router.replace('/dashboard/client');
        return;
    }

    // If an admin tries to access the client page, redirect them
    if (role === 'admin' && pathname.startsWith('/dashboard/client')) {
        router.replace('/dashboard');
        return;
    }

    setIsAuth(true);
  }, [router, pathname]);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [language, theme]);


  if (!isAuth) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background gap-4">
        <Clapperboard className="h-16 w-16 text-primary animate-pulse" />
        <p className="text-muted-foreground">{t('verifyingAccess')}</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="bg-background">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
