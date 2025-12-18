import Image from 'next/image';
import Link from 'next/link';
import Container from './Container';

const Header = () => {
  return (
    <header className='glass border-brand-border fixed z-50 w-full border-b'>
      <Container>
        <div className='flex h-16 items-center justify-between'>
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

          <nav className='text-brand-muted hidden gap-8 text-base font-semibold md:flex'>
            <Link
              href='#'
              className='transition hover:text-white'
            >
              Features
            </Link>
            <Link
              href='#'
              className='transition hover:text-white'
            >
              Workflow
            </Link>
            <Link
              href='#'
              className='transition hover:text-white'
            >
              Pricing
            </Link>
            <Link
              href='#'
              className='transition hover:text-white'
            >
              FAQ
            </Link>
          </nav>

          <div className='flex items-center gap-4'>
            <Link
              href='/sign-in'
              className='hidden text-base font-semibold text-neutral-500 hover:text-white md:inline-flex'
            >
              Sign In
            </Link>
            <Link
              href='#pricing'
              className='rounded-lg bg-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-purple-500/30 transition hover:bg-violet-600'
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
