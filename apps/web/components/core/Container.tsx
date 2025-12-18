import { cn } from '@workspace/ui/lib/utils';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

const Container = ({ children, className }: Props) => {
  return (
    <div className={cn('continer mx-auto max-w-7xl px-4 sm:px-6', className)}>
      {children}
    </div>
  );
};

export default Container;
