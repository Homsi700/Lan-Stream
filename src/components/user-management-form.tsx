
"use client";

import { useState } from 'react';
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
}

const initialUsers: User[] = [
  { id: 1, username: 'viewer1' },
  { id: 2, username: 'viewer2' },
  { id: 3, username: 'testuser' },
];

export default function UserManagementForm() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();
  const { t } = useTranslation();

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      toast({ variant: 'destructive', title: t('toast.formError.title'), description: t('toast.formError.description') });
      return;
    }
    
    if (users.some(user => user.username === newUsername)) {
        toast({ variant: 'destructive', title: 'User Exists', description: 'This username is already taken.' });
        return;
    }

    const newUser: User = {
      id: Date.now(),
      username: newUsername,
    };

    setUsers([...users, newUser]);
    setNewUsername('');
    setNewPassword('');
    toast({ title: t('toast.userAdded.title'), description: t('toast.userAdded.description') });
  };

  const handleRemoveUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    toast({ title: t('toast.userRemoved.title'), description: t('toast.userRemoved.description')});
  };

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
