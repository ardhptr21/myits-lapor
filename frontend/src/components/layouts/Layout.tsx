import AppSidebar from '@/components/layouts/Sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setUser, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = useCallback(() => {
    try {
      localStorage.removeItem('@myitslapor/token');
    } catch {
      // ignore
    }
    setUser(null);
    navigate('/auth/login');
  }, [navigate, setUser]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="p-4 flex items-center justify-between">
          <SidebarTrigger />

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon-lg">
                  <User size={40} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="p-2">
                  <div className="font-semibold">{user?.name ?? 'Guest'}</div>
                  <div className="text-sm text-muted-foreground">{user?.email ?? ''}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="py-10 px-6 md:px-20">{children}</div>
      </main>
    </SidebarProvider>
  );
}
