import { ReactNode } from 'react';

type CanvasLayoutProps = {
  children: ReactNode;
};
const CanvasLayout = ({ children }: CanvasLayoutProps) => {
  return (
    <div className='bg-sidebar flex min-h-svh w-full'>
      <div className='bg-background relative m-2 flex w-full flex-1 flex-col rounded-xl'>
        {children}
      </div>
    </div>
  );
};

export default CanvasLayout;
