
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { add } from 'date-fns';

interface User {
  id: number;
  username: string;
  password?: string;
  status: 'active' | 'inactive';
  expiresAt: string | null;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [subscriptionPeriod, setSubscriptionPeriod] = useState('1_month');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { t, language } = useTranslation();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch users.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      toast({ variant: 'destructive', title: t('toast.formError.title'), description: t('toast.formError.description') });
      return;
    }

    let expiresAt: string | null = null;
    if (subscriptionPeriod !== 'unlimited') {
        const [amount, unit] = subscriptionPeriod.split('_');
        expiresAt = add(new Date(), { [unit + 's']: parseInt(amount) }).toISOString();
    }

    const newUser: Omit<User, 'id'> & { id?: number } = {
      id: Date.now(),
      username: newUsername,
      password: newPassword,
      status: 'active',
      expiresAt: expiresAt
    };

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        });

        if (response.status === 409) {
            toast({ variant: 'destructive', title: t('userManagement.toast.userExists.title'), description: t('userManagement.toast.userExists.description') });
            return;
        }

        if (!response.ok) throw new Error('Failed to add user');

        await fetchUsers();
        setNewUsername('');
        setNewPassword('');
        toast({ title: t('toast.userAdded.title'), description: t('toast.userAdded.description') });

    } catch(error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to add user.' });
    }
  };

  const handleRemoveUser = async (id: number) => {
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      await fetchUsers();
      toast({ title: t('toast.userRemoved.title'), description: t('toast.userRemoved.description')});
    } catch(error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove user.' });
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: 'active' | 'inactive') => {
      try {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        await fetch(`/api/users/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        await fetchUsers();
        toast({ title: t('userManagement.toast.statusChanged.title'), description: t('userManagement.toast.statusChanged.description') });
      } catch(error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update status.' });
      }
  };

  const getStatusBadge = (user: User) => {
      const isExpired = user.expiresAt && new Date(user.expiresAt) < new Date();
      if (isExpired) {
          return <Badge variant="destructive">{t('userManagement.status.expired')}</Badge>;
      }
      if (user.status === 'active') {
          return <Badge className="bg-green-500 hover:bg-green-600">{t('userManagement.status.active')}</Badge>;
      }
      return <Badge variant="secondary">{t('userManagement.status.inactive')}</Badge>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">{t('userManagement.title')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
            {t('userManagement.subtitle')}
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('userManagement.form.title')}</CardTitle>
            <CardDescription>{t('userManagement.form.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="grid md:grid-cols-4 gap-4 items-end mb-8">
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
              <div className="space-y-2">
                <Label htmlFor="subscription-period">{t('userManagement.form.subscriptionLabel')}</Label>
                <Select value={subscriptionPeriod} onValueChange={setSubscriptionPeriod}>
                    <SelectTrigger id="subscription-period">
                        <SelectValue placeholder={t('userManagement.form.subscriptionPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1_week">{t('userManagement.periods.week')}</SelectItem>
                        <SelectItem value="1_month">{t('userManagement.periods.month')}</SelectItem>
                        <SelectItem value="unlimited">{t('userManagement.periods.unlimited')}</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                <PlusCircle className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t('add')}
              </Button>
            </form>

            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('userManagement.table.username')}</TableHead>
                    <TableHead>{t('userManagement.table.status')}</TableHead>
                    <TableHead>{t('userManagement.table.expiresOn')}</TableHead>
                    <TableHead className="text-right">{t('userManagement.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        </TableCell>
                    </TableRow>
                  ) : users.length > 0 ? (
                    users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono">{user.username}</TableCell>
                        <TableCell>{getStatusBadge(user)}</TableCell>
                        <TableCell>
                          {user.expiresAt 
                            ? new Date(user.expiresAt).toLocaleDateString(language)
                            : t('userManagement.periods.unlimited')}
                        </TableCell>
                        <TableCell className="text-right space-x-2 flex items-center justify-end">
                          <Switch 
                            checked={user.status === 'active'}
                            onCheckedChange={() => handleToggleStatus(user.id, user.status)}
                            aria-label={t('userManagement.toggleStatus')}
                          />
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveUser(user.id)} aria-label={t('remove')}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                            {t('userManagement.table.noUsers')}
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
