import { FileText, Home, UserPen } from 'lucide-react';

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as UISidebar,
} from '@/components/ui/sidebar';
import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const items = [
  { title: 'Beranda', url: '/', icon: Home },
  { title: 'Laporan', url: '/reports', icon: FileText },
  { title: 'Laporan Saya', url: '/reports/me', icon: UserPen },
];

export function AppSidebar() {
  const location = useLocation();

  const isActive = useCallback(
    (path: string) => {
      let active = false;
      if (path === '/') active = location.pathname === '/';
      else active = location.pathname === path;
      return active;
    },
    [location.pathname]
  );

  return (
    <UISidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-center justify-center gap-3 p-2">
            <img src="/myits-lapor-logo.png" alt="MyITS Lapor" className="h-10 w-auto" />
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton size="lg" asChild isActive={isActive(item.url)}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </UISidebar>
  );
}

export default AppSidebar;
