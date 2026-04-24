'use client';

import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Settings01Icon,
  FolderLibraryIcon,
  LayoutBottomIcon,
  AudioWave01Icon,
  CommandIcon,
} from '@hugeicons/core-free-icons';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: <HugeiconsIcon icon={LayoutBottomIcon} strokeWidth={2} />,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: <HugeiconsIcon icon={AudioWave01Icon} strokeWidth={2} />,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: <HugeiconsIcon icon={CommandIcon} strokeWidth={2} />,
      plan: 'Free',
    },
  ],
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
        <TeamSwitcher teams={data.teams} />
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
