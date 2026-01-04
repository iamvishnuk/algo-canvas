'use client';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@workspace/ui/components/sidebar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem
} from '@workspace/ui/components/dropdown-menu';
import {
  AvatarImage,
  Avatar,
  AvatarFallback
} from '@workspace/ui/components/avatar';
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  Laptop,
  Lock,
  LogOut,
  Moon,
  Sparkles,
  Sun
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const SiteFooter = () => {
  const { theme, setTheme } = useTheme();
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage
                  src={'/avatars/acdhns.jpg'}
                  alt={'Vishnu'}
                />
                <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>Demo User</span>
                <span className='truncate text-xs'>user@example.com</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage
                    src={'/avatars/acdhns.jpg'}
                    alt={'changeme'}
                  />
                  <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>Demo User</span>
                  <span className='line-clamp-1 w-full text-xs'>
                    user@example.com
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/session-and-security'>
                  <Lock />
                  Security and Session
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <div className='flex cursor-default items-center gap-2'>
                  {theme === 'light' && <Sun className='h-4 w-4' />}
                  {theme === 'dark' && <Moon className='h-4 w-4' />}
                  {theme === 'system' && <Laptop className='h-4 w-4' />}
                  Theme
                  <div className='ml-auto flex gap-1'>
                    <button
                      className='hover:bg-accent rounded p-1'
                      onClick={() => setTheme('light')}
                    >
                      <Sun className='h-4 w-4' />
                    </button>
                    <button
                      className='hover:bg-accent rounded p-1'
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className='h-4 w-4' />
                    </button>
                    <button
                      className='hover:bg-accent rounded p-1'
                      onClick={() => setTheme('system')}
                    >
                      <Laptop className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive'>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SiteFooter;
