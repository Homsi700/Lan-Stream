"use client";

import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Clapperboard, Home, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from './ui/separator';

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
  };
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground p-2 rounded-lg">
             <Clapperboard className="h-6 w-6 text-primary" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground font-headline">LAN Stream</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="/dashboard"
              isActive={pathname === '/dashboard'} 
              tooltip="Dashboard"
            >
              <Home />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              href="/dashboard/settings/access-control"
              isActive={pathname.startsWith('/dashboard/settings')}
              tooltip="Settings"
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2 bg-sidebar-border" />
         <div className="flex items-center gap-3 p-2">
            <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/100x100.png" alt="@admin" data-ai-hint="user avatar" />
                <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
                <p className="font-semibold truncate">Admin User</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">admin@lanstream.local</p>
            </div>
        </div>
        <SidebarMenuButton onClick={handleLogout} variant="default" className="bg-sidebar-accent/50 hover:bg-sidebar-accent">
          <LogOut />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
