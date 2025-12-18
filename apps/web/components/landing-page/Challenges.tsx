import Container from '../core/Container';
import {
  EraserIcon,
  GitBranchIcon,
  TerminalIcon
} from '@phosphor-icons/react/dist/ssr';

const Challenges = () => {
  return (
    <section className='bg-brand-bg gradient-section-top py-24'>
      <Container className='text-center'>
        <h2 className='mb-6 text-4xl font-extrabold'>
          The Unspoken Challenge of DSA
        </h2>
        <p className='text-brand-muted mb-12 text-xl leading-relaxed'>
          Traditional whiteboards and static console logs are failing
          developers. The gap between&nbsp;
          <span className='font-bold'>what you code</span> and
          <span className='font-bold'>what happens in memory</span> is the
          biggest bottleneck in mastering algorithms.
        </p>

        <div className='grid gap-8 text-left md:grid-cols-3'>
          <article className='rounded-xl border border-red-900/30 bg-red-900/10 p-6 opacity-80'>
            <div className='mb-4 text-3xl text-red-400'>
              <EraserIcon weight='bold' />
            </div>
            <h3 className='mb-2 text-lg font-bold text-red-500 dark:text-white'>
              Manual Chaos
            </h3>
            <p className='text-brand-muted text-sm'>
              Drawing complex graphs or rotating AVL trees by hand is
              time-consuming and prone to errors.
            </p>
          </article>
          <article className='rounded-xl border border-red-900/30 bg-red-900/10 p-6 opacity-80'>
            <div className='mb-4 text-3xl text-red-400'>
              <GitBranchIcon weight='bold' />
            </div>
            <h3 className='mb-2 text-lg font-bold text-red-500 dark:text-white'>
              Pointer Confusion
            </h3>
            <p className='text-brand-muted text-sm'>
              Losing track of `head`, `tail`, `curr`, and `prev` in Linked Lists
              results in endless bugs.
            </p>
          </article>
          <article className='rounded-xl border border-red-900/30 bg-red-900/10 p-6 opacity-80'>
            <div className='mb-4 text-3xl text-red-400'>
              <TerminalIcon weight='bold' />
            </div>
            <h3 className='mb-2 text-lg font-bold text-red-500 dark:text-white'>
              Textual Overload
            </h3>
            <p className='text-brand-muted text-sm'>
              Debugging recursion or Dynamic Programming using only console
              outputs is inefficient and overwhelming.
            </p>
          </article>
        </div>
      </Container>
    </section>
  );
};

export default Challenges;
