"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';

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

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress) return;

    // Basic validation
    const isMac = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(newAddress);
    const isIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(newAddress);

    if (!isMac && !isIp) {
      toast({ variant: 'destructive', title: 'Invalid Address', description: 'Please enter a valid IP or MAC address.' });
      return;
    }
    
    if (addresses.some(addr => addr.value === newAddress)) {
        toast({ variant: 'destructive', title: 'Address exists', description: 'This address is already on the list.' });
        return;
    }

    const newEntry: Address = {
      id: Date.now(),
      value: newAddress,
      type: isMac ? 'MAC' : 'IP',
    };

    setAddresses([...addresses, newEntry]);
    setNewAddress('');
    toast({ title: 'Address Added', description: `${newEntry.value} has been added to the allow list.` });
  };

  const handleRemoveAddress = (id: number) => {
    const addressToRemove = addresses.find(addr => addr.id === id);
    setAddresses(addresses.filter(addr => addr.id !== id));
    if(addressToRemove) {
        toast({ title: 'Address Removed', description: `${addressToRemove.value} has been removed.` });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Approved Addresses</CardTitle>
        <CardDescription>Manage the list of IP and MAC addresses that are permitted to access content.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddAddress} className="flex items-end gap-2 mb-6">
          <div className="flex-1">
            <Label htmlFor="new-address" className="sr-only">New Address</Label>
            <Input
              id="new-address"
              placeholder="Enter IP or MAC address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
          </div>
          <Button type="submit">
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </form>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                        <span className="sr-only">Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                        No addresses on the allow list.
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
