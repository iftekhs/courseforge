'use client';

import * as React from 'react';

import { Logo } from '@/components/logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { HugeiconsIcon } from '@hugeicons/react';
import { Settings01Icon, FolderLibraryIcon } from '@hugeicons/core-free-icons';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Courses',
      url: '/courses',
      icon: <HugeiconsIcon icon={FolderLibraryIcon} strokeWidth={2} />,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
