import EnableMfa from '@/components/session-and-security/EnableMfa';
import Sessions from '@/components/session-and-security/Sessions';

const page = () => {
  return (
    <div>
      <div className='mx-auto flex w-full max-w-3xl flex-col gap-2 px-6 py-8 md:max-w-5xl'>
        <h1 className='text-brand-primary text-[28px] leading-[34px] font-extrabold tracking-[-0.416px]'>
          Setup security and sessions
        </h1>
        <p className='text-sm font-normal'>
          Follow the steps to activate using the Algo Canvas.
        </p>
      </div>

      <div className='relative mx-auto w-full max-w-3xl px-6 py-0 md:max-w-5xl'>
        <div className='steps-gradient absolute top-0 h-[700px] w-px dark:bg-gray-800'></div>
        <div className='flex flex-col gap-5'>
          <div className='relative pl-6 transition duration-200 ease-in-out'>
            <div className='dark:bg-background absolute top-7 -left-[9.5px] z-10 block h-5 w-5 rounded-full bg-white'>
              <div className='border-primary mt-1 ml-1 h-3 w-3 rounded-full border-2 transition duration-200 ease-in-out'></div>
            </div>
            <div>
              <EnableMfa />
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-5'>
          <div className='relative pl-6 transition duration-200 ease-in-out'>
            <div className='dark:bg-background absolute top-7 -left-[9.5px] z-10 block h-5 w-5 rounded-full bg-white'>
              <div className='border-primary mt-1 ml-1 h-3 w-3 rounded-full border-2 transition duration-200 ease-in-out'></div>
            </div>
            <div>
              <Sessions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
