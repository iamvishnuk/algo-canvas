import Image from 'next/image';
import Container from './Container';
import Link from 'next/link';
import {
  XLogoIcon,
  GithubLogoIcon,
  DiscordLogoIcon
} from '@phosphor-icons/react/dist/ssr';
import ThemeToggle from './ThemeToggle';

const Footer = () => {
  return (
    <footer className='bg-brand-bg border-brand-border border-t py-12'>
      <Container className='flex flex-col items-center justify-between md:flex-row'>
        <div className='mb-4 flex items-center gap-2 md:mb-0'>
          <Image
            src='/algo-canvas-logo.png'
            alt='AlgoCanvas'
            width={80}
            height={80}
          />
          <span className='font-bold dark:text-white'>Algo Canvas</span>
        </div>
        <div className='text-brand-muted text-sm'>
          &copy; 2024 Algo Canvas Inc. Built with love by engineers.
        </div>
        <div className='mt-4 flex items-center gap-6 md:mt-0'>
          <ThemeToggle />
          <Link
            href='#'
            className='text-brand-muted hover:text-brand-primary transition dark:hover:text-white'
          >
            <GithubLogoIcon
              weight='bold'
              size={20}
            />
          </Link>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
