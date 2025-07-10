
"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar';
import { Clapperboard } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useAppContext } from '@/context/app-context';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const { t } = useTranslation();
  const { language, theme } = useAppContext();

  useEffect(() => {
    // This check runs on the client-side
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.replace('/');
    } else {
      setIsAuth(true);
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
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
