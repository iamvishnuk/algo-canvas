import Container from '../core/Container';
import {
  GitDiffIcon,
  NetworkIcon,
  CpuIcon
} from '@phosphor-icons/react/dist/ssr';

const WhyAlgoCanvas = () => {
  return (
    <section className='bg-brand-surface gradient-section-top py-24'>
      <Container>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-4xl font-extrabold'>
            The Smart Canvas Difference
          </h2>
          <p className='text-brand-muted text-xl'>
            We bridge the gap between abstract logic and visual reality.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          <article className='bg-brand-bg border-brand-border card-hover-effect rounded-2xl border p-8'>
            <div className='bg-brand-primary/20 text-brand-primary mb-6 flex h-14 w-14 items-center justify-center rounded-full text-2xl'>
              <GitDiffIcon weight='bold' />
            </div>
            <h3 className='mb-3 text-xl font-bold'>Code-to-Diagram</h3>
            <p className='text-brand-muted text-sm leading-relaxed'>
              Instantly convert data structures (Arrays, Adjacency Lists, JSON)
              from your code into a clean, interactive diagram.
            </p>
          </article>

          <article className='bg-brand-bg border-brand-border card-hover-effect rounded-2xl border p-8'>
            <div className='bg-brand-accent/20 text-brand-accent mb-6 flex h-14 w-14 items-center justify-center rounded-full text-2xl'>
              <NetworkIcon weight='bold' />
            </div>
            <h3 className='mb-3 text-xl font-bold'>Intelligent Layouts</h3>
            <p className='text-brand-muted text-sm leading-relaxed'>
              Drag-and-drop structures (Heaps, Tries). Our engine auto-arranges
              and ensures graphical integrity, saving hours of manual labor.
            </p>
          </article>

          <article className='bg-brand-bg border-brand-border card-hover-effect rounded-2xl border p-8'>
            <div className='bg-brand-success/20 text-brand-success mb-6 flex h-14 w-14 items-center justify-center rounded-full text-2xl'>
              <CpuIcon weight='bold' />
            </div>
            <h3 className='mb-3 text-xl font-bold'>Visual Memory Trace</h3>
            <p className='text-brand-muted text-sm leading-relaxed'>
              Click a node on the canvas, and see the exact line of code in your
              editor that created or modified it.
            </p>
          </article>
        </div>
      </Container>
    </section>
  );
};

export default WhyAlgoCanvas;
