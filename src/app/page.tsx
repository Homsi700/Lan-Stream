
"use client"
import { LoginForm } from "@/components/login-form";
import { Clapperboard } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="bg-primary/10 p-4 rounded-full">
            <Clapperboard className="h-12 w-12 text-primary" />
          </div>
          <h1 className="mt-6 text-4xl font-bold text-primary font-headline">
            {t('appName')}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t('login.subtitle')}
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
