'use client';
import { DASHBOARD_MENU_ITEMS } from '@/lib/constant';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@workspace/ui/components/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar
      collapsible='offcanvas'
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='!hover:bg-none data-[slot=sidebar-menu-button]:!p-1.5'
            >
              <Link href='/dashboard'>
                <Image
                  src='/algo-canvas-logo.png'
                  alt='AlgoCanvas'
                  width={50}
                  height={50}
                />
                <span className='text-xl font-extrabold tracking-tighter'>
                  Algo Canvas
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className='flex flex-col gap-2'>
            <SidebarMenu>
              {DASHBOARD_MENU_ITEMS.map((item) => (
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={pathname === item.href}
                  asChild
                  className='!text-white data-[active=true]:bg-purple-500'
                >
                  <Link href={item.href}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
