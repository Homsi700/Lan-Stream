
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface User {
  id: number;
  username: string;
  password?: string; // Password is now part of the user object
}

const USERS_STORAGE_KEY = 'lan_stream_users';

export default function UserManagementForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Load users from localStorage on component mount
    if (typeof window !== 'undefined') {
        const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        }
        setIsClient(true);
    }
  }, []);

  const { toast } = useToast();
  const { t } = useTranslation();

  const persistUsers = (updatedUsers: User[]) => {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      toast({ variant: 'destructive', title: t('toast.formError.title'), description: t('toast.formError.description') });
      return;
    }
    
    if (users.some(user => user.username === newUsername) || newUsername === 'admin') {
        toast({ variant: 'destructive', title: 'User Exists', description: 'This username is already taken.' });
        return;
    }

    const newUser: User = {
      id: Date.now(),
      username: newUsername,
      password: newPassword
    };
    
    persistUsers([...users, newUser]);
    setNewUsername('');
    setNewPassword('');
    toast({ title: t('toast.userAdded.title'), description: t('toast.userAdded.description') });
  };

  const handleRemoveUser = (id: number) => {
    const updatedUsers = users.filter(user => user.id !== id);
    persistUsers(updatedUsers);
    toast({ title: t('toast.userRemoved.title'), description: t('toast.userRemoved.description')});
  };

  if (!isClient) {
    return null; // Don't render on the server
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{t('userManagement.form.title')}</CardTitle>
        <CardDescription>{t('userManagement.form.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddUser} className="grid md:grid-cols-3 gap-4 items-end mb-6">
          <div className="space-y-2">
            <Label htmlFor="new-username">{t('userManagement.form.usernameLabel')}</Label>
            <Input
              id="new-username"
              placeholder={t('userManagement.form.usernamePlaceholder')}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">{t('userManagement.form.passwordLabel')}</Label>
             <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder={t('userManagement.form.passwordPlaceholder')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto">
            <PlusCircle className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t('add')}
          </Button>
        </form>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('userManagement.table.username')}</TableHead>
                <TableHead className="text-right">{t('userManagement.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono">{user.username}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveUser(user.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">{t('remove')}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground h-24">
                        {t('userManagement.table.noUsers')}
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
