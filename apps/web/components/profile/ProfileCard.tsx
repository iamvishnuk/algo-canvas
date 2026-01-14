import { useAuthContext } from '@/providers/AuthProvider';
import { Separator } from '@algocanvas/ui/components/separator';
import Image from 'next/image';

const ProfileCard = () => {
  const { user } = useAuthContext();
  return (
    <div className='border-brand-border w-full rounded-md border p-8 shadow-lg'>
      <h1 className='text-brand-primary text-[28px] leading-[34px] font-extrabold tracking-[-0.416px]'>
        My Profile
      </h1>

      <div className='mt-8'>
        <div className='relative size-[100px] rounded-full'>
          <Image
            alt='profile Image'
            src={'https://github.com/shadcn.png'}
            fill
            className='rounded-full'
          />
        </div>
        <Separator className='my-5' />

        <p className='mt-2 text-base font-medium'>Personal information</p>
        <div className='mt-4 max-w-2xl space-y-4'>
          <div className='bg-sidebar-accent/30 border-sidebar-accent rounded-lg border p-4'>
            <p className='text-brand-primary text-sm'>Name</p>
            <p className='text-base font-medium'>{user?.name}</p>
          </div>
          <div className='bg-sidebar-accent/30 border-sidebar-accent rounded-lg border p-4'>
            <p className='text-brand-primary text-sm'>Email</p>
            <p className='text-base font-medium'>{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
