import { section } from 'motion/react-m';
import Container from '../core/Container';
import { Check } from 'lucide-react';
import Link from 'next/link';

const Pricing = () => {
  return (
    <section className='bg-brand-bg relative overflow-hidden py-32'>
      <div className='from-brand-primary/10 absolute inset-0 bg-gradient-to-t to-transparent'></div>
      <Container className='relative z-10 text-center'>
        <h2 className='mb-6 text-5xl font-extrabold'>
          Unlock Your Full Potential
        </h2>
        <p className='text-brand-muted mx-auto mb-12 max-w-2xl text-xl'>
          Start for free, upgrade when you're ready to tackle the advanced
          structures and interview simulations.
        </p>

        <div className='mx-auto grid max-w-6xl gap-8 md:grid-cols-3'>
          <div className='border-brand-border bg-brand-surface hover:border-brand-muted card-hover-effect rounded-3xl border p-10 transition'>
            <h3 className='mb-2 text-2xl font-bold'>Basic</h3>
            <div className='mb-4 text-4xl font-extrabold'>
              $0{' '}
              <span className='text-brand-muted text-base font-normal'>
                / mo
              </span>
            </div>
            <ul className='text-brand-muted mb-10 space-y-3 text-left text-sm'>
              <li className='flex items-center gap-1'>
                <Check size={20} />
                Core Data Types
              </li>
              <li className='flex items-center gap-1'>
                <Check size={20} />
                Unlimited Public Boards
              </li>
              <li className='flex items-center gap-1'>
                <Check size={20} />
                Read-only Community Templates
              </li>
            </ul>
            <Link
              href='#'
              className='border-brand-border hover:bg-brand-border block w-full rounded-xl border py-3 font-semibold transition'
            >
              Start Free Forever
            </Link>
          </div>

          <div className='border-brand-primary bg-brand-surface shadow-3xl relative transform rounded-3xl border-2 p-10 md:-translate-y-4'>
            <div className='bg-brand-primary absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-1.5 text-xs font-extrabold tracking-wider text-white'>
              PREMIUM
            </div>
            <h3 className='mb-2 text-2xl font-bold'>Pro Engineer</h3>
            <div className='mb-4 text-4xl font-extrabold'>
              $15{' '}
              <span className='text-brand-muted text-base font-normal'>
                / mo
              </span>
            </div>
            <ul className='mb-10 space-y-3 text-left text-sm dark:text-white'>
              <li className='flex items-center gap-1'>
                <Check size={20} />
                Visual Debugger (Python/Java)
              </li>
              <li className='flex items-center gap-1'>
                <Check size={20} />
                Advanced Structures (AVL, Tries, Max Flow)
              </li>
              <li className='flex items-center gap-1'>
                <Check size={20} />
                Private Boards & Cloud Sync
              </li>
            </ul>
            <Link
              href='#'
              className='bg-brand-primary shadow-brand-primary/30 block w-full rounded-xl py-3 font-extrabold shadow-lg transition hover:bg-violet-600'
            >
              Get Pro Access
            </Link>
          </div>

          <div className='border-brand-border bg-brand-surface hover:border-brand-muted card-hover-effect rounded-3xl border p-10 transition'>
            <h3 className='mb-2 text-2xl font-bold'>Interviewer</h3>
            <div className='mb-4 text-4xl font-extrabold'>
              $39{' '}
              <span className='text-brand-muted text-base font-normal'>
                / mo
              </span>
            </div>
            <ul className='text-brand-muted mb-10 space-y-3 text-left text-sm'>
              <li className='flex items-center gap-1'>
                <Check size={20} />
                **Collaborative Live Interview Mode**
              </li>
              <li className='flex items-center gap-1'>
                <Check size={20} />
                Interview Recording & Playback
              </li>
              <li className='flex items-center gap-1'>
                <Check size={20} />
                Team Solution Library & Sharing
              </li>
            </ul>
            <Link
              href='#'
              className='border-brand-border hover:bg-brand-border block w-full rounded-xl border py-3 font-semibold transition'
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Pricing;
