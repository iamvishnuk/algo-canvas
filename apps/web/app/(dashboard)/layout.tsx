import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { SiteHeader } from '@/components/dashboard/SiteHeader';
import {
  SidebarInset,
  SidebarProvider
} from '@workspace/ui/components/sidebar';
import { ReactNode } from 'react';

type DashBoardProps = {
  children: ReactNode;
};
const DashBoardLayout = ({ children }: DashBoardProps) => {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)'
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant='inset'
        className=''
      />
      <SidebarInset>
        <SiteHeader />
        <div className='p-6'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashBoardLayout;
