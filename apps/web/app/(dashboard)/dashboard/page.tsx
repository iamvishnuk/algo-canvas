import { Plus } from 'lucide-react';
import Link from 'next/link';

const page = () => {
  return (
    <div>
      <div className='md:grid-col-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        <Link
          href={'/canvas/1'}
          className='text-brand-muted flex flex-col items-center gap-5 rounded-md border py-5 transition-all hover:cursor-pointer hover:border-white/80 hover:text-white/80'
        >
          <Plus size={40} />
          <span>Create a blank canvas</span>
        </Link>
      </div>
    </div>
  );
};

export default page;
