
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface Address {
  id: number;
  value: string;
  type: 'IP' | 'MAC';
}

const initialAddresses: Address[] = [
  { id: 1, value: '192.168.88.101', type: 'IP' },
  { id: 2, value: '00:0A:95:9D:68:16', type: 'MAC' },
  { id: 3, value: '192.168.88.254', type: 'IP' },
];

export default function AccessControlForm() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [newAddress, setNewAddress] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress) return;

    // Basic validation
    const isMac = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(newAddress);
    const isIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(newAddress);

    if (!isMac && !isIp) {
      toast({ variant: 'destructive', title: t('toast.invalidAddress.title'), description: t('toast.invalidAddress.description') });
      return;
    }
    
    if (addresses.some(addr => addr.value === newAddress)) {
        toast({ variant: 'destructive', title: t('toast.addressExists.title'), description: t('toast.addressExists.description') });
        return;
    }

    const newEntry: Address = {
      id: Date.now(),
      value: newAddress,
      type: isMac ? 'MAC' : 'IP',
    };

    setAddresses([...addresses, newEntry]);
    setNewAddress('');
    toast({ title: t('toast.addressAdded.title'), description: `${newEntry.value} ${t('toast.addressAdded.description')}` });
  };

  const handleRemoveAddress = (id: number) => {
    const addressToRemove = addresses.find(addr => addr.id === id);
    setAddresses(addresses.filter(addr => addr.id !== id));
    if(addressToRemove) {
        toast({ title: t('toast.addressRemoved.title'), description: `${addressToRemove.value} ${t('toast.addressRemoved.description')}` });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{t('accessControl.form.title')}</CardTitle>
        <CardDescription>{t('accessControl.form.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddAddress} className="flex items-end gap-2 mb-6">
          <div className="flex-1">
            <Label htmlFor="new-address" className="sr-only">{t('accessControl.form.newAddressLabel')}</Label>
            <Input
              id="new-address"
              placeholder={t('accessControl.form.newAddressPlaceholder')}
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
          </div>
          <Button type="submit">
            <PlusCircle className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t('add')}
          </Button>
        </form>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('accessControl.table.address')}</TableHead>
                <TableHead>{t('accessControl.table.type')}</TableHead>
                <TableHead className="text-right">{t('accessControl.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addresses.length > 0 ? (
                addresses.map(addr => (
                  <TableRow key={addr.id}>
                    <TableCell className="font-mono">{addr.value}</TableCell>
                    <TableCell>{addr.type}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveAddress(addr.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">{t('remove')}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                        {t('accessControl.table.noAddresses')}
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
