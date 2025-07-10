
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const USERS_STORAGE_KEY = 'lan_stream_users';

const getStoredUsers = () => {
    if (typeof window === 'undefined') return [];
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    try {
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (e) {
        return [];
    }
};


export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Admin user
      if (username === 'admin' && password === 'password') {
        toast({
          title: t('toast.loginSuccess.title'),
          description: t('toast.loginSuccess.description'),
        });
        localStorage.setItem("auth_token", `dummy_token_for_admin`);
        localStorage.setItem("user_role", 'admin');
        router.push("/dashboard");
        return;
      }

      // Regular users
      const storedUsers = getStoredUsers();
      const foundUser = storedUsers.find(
        (user: any) => user.username === username && user.password === password
      );

      if (foundUser) {
        const isExpired = foundUser.expiresAt && new Date(foundUser.expiresAt) < new Date();
        if (foundUser.status === 'inactive' || isExpired) {
            toast({
                variant: "destructive",
                title: t('toast.accountError.title'),
                description: t('toast.accountError.description'),
            });
            setIsLoading(false);
            return;
        }

        toast({
          title: t('toast.loginSuccess.title'),
          description: t('toast.loginSuccess.description'),
        });
        
        localStorage.setItem("auth_token", `dummy_token_for_${username}`);
        localStorage.setItem("user_role", 'user');
        router.push("/dashboard/client");
      } else {
        toast({
          variant: "destructive",
          title: t('toast.loginFailed.title'),
          description: t('toast.loginFailed.description'),
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <Card className="shadow-2xl shadow-primary/5">
      <CardHeader>
        <CardTitle>{t('login.welcome')}</CardTitle>
        <CardDescription>{t('login.enterCredentials')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">{t('login.username')}</Label>
            <Input
              id="username"
              type="text"
              placeholder={t('login.username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('login.password')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t('login.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('login.signingIn') : t('login.signIn')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
