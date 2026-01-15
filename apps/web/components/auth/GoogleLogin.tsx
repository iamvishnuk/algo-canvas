import { Button } from '@algocanvas/ui/components/button';
import { GoogleLogoIcon } from '@phosphor-icons/react';
import Link from 'next/link';

const GoogleLogin = () => {
  return (
    <Button
      variant='outline'
      asChild
    >
      <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
        <GoogleLogoIcon />
        Login With Google
      </Link>
    </Button>
  );
};

export default GoogleLogin;
