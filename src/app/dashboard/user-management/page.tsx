
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Eye, EyeOff, Loader2, Pencil, History } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { add, formatISO, parseISO } from 'date-fns';

interface User {
  id: number;
  username: string;
  password?: string;
  status: 'active' | 'inactive';
  expiresAt: string | null;
  deviceLimit: number;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [subscriptionPeriod, setSubscriptionPeriod] = useState('1_month');
  const [deviceLimit, setDeviceLimit] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editShowPassword, setEditShowPassword] = useState(false);
  
  const [renewingUser, setRenewingUser] = useState<User | null>(null);
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
  const [renewalPeriod, setRenewalPeriod] = useState('1_month');


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
      expiresAt: expiresAt,
      deviceLimit: deviceLimit,
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
        setDeviceLimit(1);
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

  const handleEditUser = (user: User) => {
    setEditingUser({...user, password: ''}); // Clear password for security
    setIsEditDialogOpen(true);
  }

  const handleRenewUser = (user: User) => {
    setRenewingUser(user);
    setRenewalPeriod('1_month');
    setIsRenewDialogOpen(true);
  };

  const handleConfirmRenewal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewingUser) return;

    try {
        await fetch(`/api/users/${renewingUser.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ renewalPeriod: renewalPeriod }),
        });
        await fetchUsers();
        setIsRenewDialogOpen(false);
        setRenewingUser(null);
        toast({ title: t('userManagement.toast.renewSuccess.title'), description: t('userManagement.toast.renewSuccess.description') });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: t('userManagement.toast.renewError.description') });
    }
  };


  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    // Create a payload with only the fields that should be updated
    const payload: Partial<User> = {
      username: editingUser.username,
      expiresAt: editingUser.expiresAt,
      deviceLimit: editingUser.deviceLimit,
    };

    // Only include the password if a new one was entered
    if (editingUser.password) {
      payload.password = editingUser.password;
    }

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.status === 409) {
        toast({ variant: 'destructive', title: t('userManagement.toast.userExists.title'), description: t('userManagement.toast.userExists.description') });
        return;
      }
      if (!response.ok) throw new Error('Failed to update user');

      await fetchUsers();
      setIsEditDialogOpen(false);
      setEditingUser(null);
      toast({ title: t('userManagement.toast.userUpdated.title'), description: t('userManagement.toast.userUpdated.description') });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update user.' });
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

  const renderEditForm = () => {
    if (!editingUser) return null;

    return (
      <form onSubmit={handleUpdateUser} className="space-y-4">
        <div>
          <Label htmlFor="edit-username">{t('userManagement.form.usernameLabel')}</Label>
          <Input id="edit-username" value={editingUser.username} onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}/>
        </div>
        <div>
          <Label htmlFor="edit-password">{t('userManagement.form.passwordLabel')} ({t('optional')})</Label>
          <div className="relative">
            <Input id="edit-password" type={editShowPassword ? 'text' : 'password'} placeholder={t('userManagement.form.passwordPlaceholderOptional')} value={editingUser.password} onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })} />
             <Button
                type="button" variant="ghost" size="icon"
                className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground"
                onClick={() => setEditShowPassword(!editShowPassword)}
              >
                {editShowPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="edit-expiresAt">{t('userManagement.table.expiresOn')}</Label>
          <Input id="edit-expiresAt" type="date" value={editingUser.expiresAt ? formatISO(parseISO(editingUser.expiresAt), { representation: 'date' }) : ''} onChange={(e) => setEditingUser({ ...editingUser, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null })} />
        </div>
        <div>
          <Label htmlFor="edit-deviceLimit">{t('userManagement.form.deviceLimitLabel')}</Label>
          <Input id="edit-deviceLimit" type="number" min="1" value={editingUser.deviceLimit} onChange={(e) => setEditingUser({ ...editingUser, deviceLimit: parseInt(e.target.value, 10) || 1 })} />
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">{t('cancel')}</Button>
            </DialogClose>
            <Button type="submit">{t('saveChanges')}</Button>
        </DialogFooter>
      </form>
    );
  };
  
  const renderRenewForm = () => {
    if (!renewingUser) return null;
    return (
        <form onSubmit={handleConfirmRenewal} className="space-y-4">
            <p>
                {t('userManagement.renewUser.confirmation')} <strong>{renewingUser.username}</strong>.
            </p>
            <div>
                <Label htmlFor="renewal-period">{t('userManagement.form.subscriptionLabel')}</Label>
                <Select value={renewalPeriod} onValueChange={setRenewalPeriod}>
                    <SelectTrigger id="renewal-period">
                        <SelectValue placeholder={t('userManagement.form.subscriptionPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1_week">{t('userManagement.periods.week')}</SelectItem>
                        <SelectItem value="1_month">{t('userManagement.periods.month')}</SelectItem>
                        <SelectItem value="unlimited">{t('userManagement.periods.unlimited')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">{t('cancel')}</Button>
                </DialogClose>
                <Button type="submit">{t('userManagement.renewUser.renewButton')}</Button>
            </DialogFooter>
        </form>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">{t('userManagement.title')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
            {t('userManagement.subtitle')}
        </p>
      </header>
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('userManagement.form.title')}</CardTitle>
            <CardDescription>{t('userManagement.form.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-8">
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
              <div className="space-y-2">
                <Label htmlFor="device-limit">{t('userManagement.form.deviceLimitLabel')}</Label>
                <Input
                  id="device-limit"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={deviceLimit}
                  onChange={(e) => setDeviceLimit(parseInt(e.target.value, 10) || 1)}
                />
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
                    <TableHead>{t('userManagement.table.deviceLimit')}</TableHead>
                    <TableHead className="text-right">{t('userManagement.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                     <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        </TableCell>
                    </TableRow>
                  ) : users.length > 0 ? (
                    users.map(user => {
                      const isExpired = user.expiresAt && new Date(user.expiresAt) < new Date();
                      return (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono">{user.username}</TableCell>
                        <TableCell>{getStatusBadge(user)}</TableCell>
                        <TableCell>
                          {user.expiresAt 
                            ? new Date(user.expiresAt).toLocaleDateString(language)
                            : t('userManagement.periods.unlimited')}
                        </TableCell>
                        <TableCell className="text-center">{user.deviceLimit}</TableCell>
                        <TableCell className="text-right space-x-0 flex items-center justify-end">
                          {isExpired || user.status === 'inactive' ? (
                            <Button variant="ghost" size="icon" onClick={() => handleRenewUser(user)} aria-label={t('userManagement.renewUser.renewButton')}>
                                <History className="h-4 w-4 text-blue-500" />
                            </Button>
                          ) : (
                            <Switch 
                                checked={user.status === 'active'}
                                onCheckedChange={() => handleToggleStatus(user.id, user.status)}
                                aria-label={t('userManagement.toggleStatus')}
                                className="mr-2"
                            />
                          )}
                           <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)} aria-label={t('edit')}>
                            <Pencil className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveUser(user.id)} aria-label={t('remove')}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
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

       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('userManagement.editUser.title')}</DialogTitle>
                </DialogHeader>
                {renderEditForm()}
            </DialogContent>
        </Dialog>
        
       <Dialog open={isRenewDialogOpen} onOpenChange={setIsRenewDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('userManagement.renewUser.title')}</DialogTitle>
                </DialogHeader>
                {renderRenewForm()}
            </DialogContent>
        </Dialog>
    </div>
  );
}
