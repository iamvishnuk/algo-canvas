'use client';

import PasswordCard from '@/components/profile/PasswordCard';
import ProfileCard from '@/components/profile/ProfileCard';
import UpdateEmail from '@/components/profile/UpdateEmail';
import { Button } from '@algocanvas/ui/components/button';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useState, Activity } from 'react';

const page = () => {
  const [activeSection, setActiveSection] = useState<
    'profile' | 'password' | 'update-email'
  >('profile');

  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-2 px-6 py-8 md:max-w-5xl'>
      <h1 className='text-brand-primary text-[28px] leading-[34px] font-extrabold tracking-[-0.416px]'>
        Account Settings
      </h1>
      <p className='text-sm font-normal'>
        Manage your profile information and security preferences.
      </p>

      <div className='mt-12 grid grid-cols-4 gap-6'>
        <div className='col-span-1'>
          <div className='flex flex-col space-y-2'>
            <Button
              onClick={() => setActiveSection('profile')}
              className='group bg-brand-primary hover:bg-brand-primary/90 flex items-center justify-between font-medium text-white transition-all duration-200 hover:cursor-pointer'
            >
              <span className='flex items-center gap-2'>
                <User />
                Profile
              </span>
              {activeSection === 'profile' && (
                <ArrowRight
                  size={16}
                  className='transition-transform group-hover:translate-x-1'
                />
              )}
            </Button>
            <Button
              onClick={() => setActiveSection('update-email')}
              className='group bg-brand-primary hover:bg-brand-primary/90 flex items-center justify-between font-medium text-white transition-all duration-200 hover:cursor-pointer'
            >
              <span className='flex items-center gap-2'>
                <Mail />
                Update Email
              </span>
              {activeSection === 'update-email' && (
                <ArrowRight
                  size={16}
                  className='transition-transform group-hover:translate-x-1'
                />
              )}
            </Button>
            <Button
              onClick={() => setActiveSection('password')}
              className='group bg-brand-primary hover:bg-brand-primary/90 flex items-center justify-between font-medium text-white transition-all duration-200 hover:cursor-pointer'
            >
              <span className='flex items-center gap-2'>
                <Lock />
                Security
              </span>
              {activeSection === 'password' && (
                <ArrowRight
                  size={16}
                  className='transition-transform group-hover:translate-x-1'
                />
              )}
            </Button>
          </div>
        </div>
        <div className='col-span-3'>
          <Activity mode={activeSection === 'profile' ? 'visible' : 'hidden'}>
            <ProfileCard />
          </Activity>
          <Activity
            mode={activeSection === 'update-email' ? 'visible' : 'hidden'}
          >
            <UpdateEmail />
          </Activity>
          <Activity mode={activeSection === 'password' ? 'visible' : 'hidden'}>
            <PasswordCard />
          </Activity>
        </div>
      </div>
    </div>
  );
};

export default page;
