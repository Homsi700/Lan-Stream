
"use client";
import { VideoCatalog } from '../video-catalog';
import { useTranslation } from '@/hooks/use-translation';

export default function ClientDashboardPage() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">{t('dashboard.clientTitle')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('dashboard.clientSubtitle')}
        </p>
      </header>
      <VideoCatalog />
    </div>
  );
}
