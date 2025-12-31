import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className='bg-brand-bg grid min-h-svh lg:grid-cols-2'>
      <div className='hero-glow flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'>
          <Link
            href='/'
            className='flex items-center'
          >
            <Image
              src='/algo-canvas-logo.png'
              alt='AlgoCanvas'
              width={80}
              height={80}
            />
            <span className='text-2xl font-extrabold tracking-tighter'>
              Algo Canvas
            </span>
          </Link>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-md'>{children}</div>
        </div>
      </div>

      <div className='bg-muted relative hidden lg:block'>
        <img
          src='/placeholder.svg'
          alt='Image'
          className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        />
      </div>
    </div>
  );
}
