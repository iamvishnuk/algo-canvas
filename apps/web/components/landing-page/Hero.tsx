'use client';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import Container from '../core/Container';

type Step = {
  node: number | null;
  stack: number[];
  visited: number[];
  line: number;
};

const Hero = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visited, setVisited] = useState<number[]>([]);
  const [stack, setStack] = useState<number[]>([]);

  const steps: Step[] = [
    { node: 1, stack: [1], visited: [], line: 2 },
    { node: 1, stack: [1], visited: [1], line: 3 },
    { node: 2, stack: [1, 2], visited: [1], line: 2 },
    { node: 2, stack: [1, 2], visited: [1, 2], line: 3 },
    { node: null, stack: [1], visited: [1, 2], line: 4 },
    { node: 3, stack: [1, 3], visited: [1, 2], line: 2 },
    { node: 3, stack: [1, 3], visited: [1, 2, 3], line: 3 },
    { node: null, stack: [1], visited: [1, 2, 3], line: 4 },
    { node: null, stack: [], visited: [1, 2, 3], line: 5 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % steps.length;
        const step = steps[next] as Step;
        setStack(step.stack);
        setVisited(step.visited);
        return next;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  const isNodeActive = (nodeId: number) => {
    return steps[currentStep]?.node === nodeId;
  };

  const isNodeVisited = (nodeId: number) => {
    return visited.includes(nodeId);
  };

  return (
    <div className='relative overflow-hidden pt-32 pb-20 text-white lg:pt-48'>
      <div className='hero-glow absolute inset-0 -z-10' />
      <div className='grid-pattern absolute inset-0 -z-20' />
      <Container className='grid items-center gap-16 lg:grid-cols-2'>
        <motion.div
          className='space-y-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className='border-brand-border bg-brand-surface text-brand-accent inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <span className='bg-brand-success h-2 w-2 animate-pulse rounded-full' />
            Now featuring Python & Java runtime analysis
          </motion.div>

          <motion.h1
            className='text-6xl leading-tight font-extrabold tracking-tighter text-black lg:text-7xl dark:text-white'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Visualize the <br />
            <span className='from-brand-primary to-brand-accent bg-gradient-to-r bg-clip-text text-transparent'>
              Abstract Logic.
            </span>
          </motion.h1>

          <motion.p
            className='text-brand-muted max-w-xl text-xl leading-relaxed'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            The DSA smart canvas designed for deep understanding. Turn cryptic
            code into dynamic, interactive data structures instantly.
          </motion.p>

          <motion.div
            className='flex flex-col gap-4 pt-4 sm:flex-row'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.a
              href='#pricing'
              className='flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-extrabold text-black shadow-lg transition-all hover:shadow-xl'
              whileHover={{ scale: 1.02, backgroundColor: '#f3f4f6' }}
              whileTap={{ scale: 0.98 }}
            >
              Start Sketching Free{' '}
              <motion.i
                className='fa-solid fa-arrow-right-long'
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              />
            </motion.a>
            <motion.a
              href='#demo'
              className='dark:border-brand-border dark:bg-brand-surface bg-brand-primary dark:hover:border-brand-primary rounded-xl border px-8 py-4 font-medium transition-colors dark:text-white'
              whileHover={{ scale: 1.02, borderColor: 'rgb(124 58 237)' }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Live Demo
            </motion.a>
          </motion.div>

          {/* <motion.div */}
          {/*   className='text-brand-muted flex items-center gap-6 pt-4 text-sm' */}
          {/*   initial={{ opacity: 0 }} */}
          {/*   animate={{ opacity: 1 }} */}
          {/*   transition={{ delay: 0.6, duration: 0.6 }} */}
          {/* > */}
          {/*   <span> */}
          {/*     <i className='fa-solid fa-check-circle text-brand-success mr-2' />{' '} */}
          {/*     Trusted by 10k+ Engineers */}
          {/*   </span> */}
          {/* </motion.div> */}
        </motion.div>

        <motion.div
          className='group relative'
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <motion.div
            className='from-brand-primary/50 to-brand-accent/50 absolute -inset-1 rounded-2xl bg-gradient-to-r opacity-40 blur-lg'
            animate={{
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <div className='border-brand-border glass shadow-3xl relative overflow-hidden rounded-2xl border'>
            <div className='grid h-[450px] grid-cols-5'>
              <div className='border-brand-border bg-brand-bg col-span-2 overflow-auto border-r p-5 text-xs leading-relaxed'>
                <div className='text-brand-muted mb-3 flex items-center justify-between text-[10px] tracking-wider uppercase'>
                  <span>JavaScript: DFS Traversal</span>
                  <motion.span
                    className='text-brand-accent'
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ●
                  </motion.span>
                </div>

                <div className='font-fira-code space-y-1'>
                  <motion.div
                    className={`transition-colors ${steps[currentStep]?.line === 1 ? 'bg-brand-primary/20 border-brand-primary -ml-5 border-l-2 pl-5' : ''}`}
                    animate={{
                      backgroundColor:
                        steps[currentStep]?.line === 1
                          ? 'rgba(124, 58, 237, 0.2)'
                          : 'transparent'
                    }}
                  >
                    <span className='text-purple-400'>function</span>{' '}
                    <span className='text-yellow-400'>dfs</span>
                    <span className='text-white'>(</span>
                    <span className='text-orange-400'>node</span>
                    <span className='text-white'>) {'{'}</span>
                  </motion.div>

                  <motion.div
                    className={`pl-4 transition-colors ${steps[currentStep]?.line === 2 ? 'bg-brand-primary/20 border-brand-primary -ml-5 border-l-2 pl-9' : ''}`}
                    animate={{
                      backgroundColor:
                        steps[currentStep]?.line === 2
                          ? 'rgba(124, 58, 237, 0.2)'
                          : 'transparent'
                    }}
                  >
                    <span className='text-purple-400'>if</span>{' '}
                    <span className='text-white'>(!</span>
                    <span className='text-orange-400'>node</span>
                    <span className='text-white'>) </span>
                    <span className='text-purple-400'>return</span>
                    <span className='text-white'>;</span>
                  </motion.div>

                  <motion.div
                    className={`pl-4 transition-colors ${steps[currentStep]?.line === 3 ? 'bg-brand-primary/20 border-brand-primary -ml-5 border-l-2 pl-9' : ''}`}
                    animate={{
                      backgroundColor:
                        steps[currentStep]?.line === 3
                          ? 'rgba(124, 58, 237, 0.2)'
                          : 'transparent'
                    }}
                  >
                    <span className='text-blue-400'>console</span>
                    <span className='text-white'>.</span>
                    <span className='text-yellow-400'>log</span>
                    <span className='text-white'>(</span>
                    <span className='text-orange-400'>node</span>
                    <span className='text-white'>.</span>
                    <span className='text-orange-400'>val</span>
                    <span className='text-white'>);</span>
                  </motion.div>

                  <motion.div
                    className={`pl-4 transition-colors ${steps[currentStep]?.line === 4 ? 'bg-brand-primary/20 border-brand-primary -ml-5 border-l-2 pl-9' : ''}`}
                    animate={{
                      backgroundColor:
                        steps[currentStep]?.line === 4
                          ? 'rgba(124, 58, 237, 0.2)'
                          : 'transparent'
                    }}
                  >
                    <span className='text-yellow-400'>dfs</span>
                    <span className='text-white'>(</span>
                    <span className='text-orange-400'>node</span>
                    <span className='text-white'>.</span>
                    <span className='text-orange-400'>left</span>
                    <span className='text-white'>);</span>
                  </motion.div>

                  <motion.div
                    className={`pl-4 transition-colors ${steps[currentStep]?.line === 5 ? 'bg-brand-primary/20 border-brand-primary -ml-5 border-l-2 pl-9' : ''}`}
                    animate={{
                      backgroundColor:
                        steps[currentStep]?.line === 5
                          ? 'rgba(124, 58, 237, 0.2)'
                          : 'transparent'
                    }}
                  >
                    <span className='text-yellow-400'>dfs</span>
                    <span className='text-white'>(</span>
                    <span className='text-orange-400'>node</span>
                    <span className='text-white'>.</span>
                    <span className='text-orange-400'>right</span>
                    <span className='text-white'>);</span>
                  </motion.div>

                  <div className='text-white'>{'}'}</div>
                </div>

                <motion.div className='text-brand-muted border-brand-border mt-6 space-y-2 border-t pt-4'>
                  <div className='flex items-center gap-2 text-xs'>
                    <span className='text-brand-accent font-semibold'>
                      Call Stack:
                    </span>
                    <div className='flex gap-1'>
                      <AnimatePresence mode='popLayout'>
                        {stack.map((node, index) => (
                          <motion.span
                            key={`${node}-${index}`}
                            className='bg-brand-surface border-brand-border text-brand-primary rounded border px-2 py-0.5 font-bold'
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500 }}
                          >
                            {node}
                          </motion.span>
                        ))}
                      </AnimatePresence>
                      {stack.length === 0 && (
                        <span className='text-brand-muted text-xs'>Empty</span>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-2 text-xs'>
                    <span className='text-brand-success font-semibold'>
                      Visited:
                    </span>
                    <div className='flex gap-1'>
                      {visited.map((node) => (
                        <motion.span
                          key={node}
                          className='bg-brand-success/20 text-brand-success rounded px-2 py-0.5 font-bold'
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          {node}
                        </motion.span>
                      ))}
                      {visited.length === 0 && (
                        <span className='text-brand-muted text-xs'>None</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className='bg-brand-surface relative col-span-3 flex items-center justify-center'>
                <div className='flex scale-110 transform flex-col items-center gap-8'>
                  {/* Root Node */}
                  <motion.div
                    className={`flex h-14 w-14 items-center justify-center rounded-full border-2 font-bold text-white shadow-xl transition-all ${
                      isNodeActive(1)
                        ? 'border-brand-primary bg-brand-primary/60 ring-brand-primary/30 ring-4'
                        : isNodeVisited(1)
                          ? 'border-brand-success bg-brand-success/40'
                          : 'border-brand-muted bg-brand-surface text-brand-muted'
                    }`}
                    animate={
                      isNodeActive(1)
                        ? {
                            scale: [1, 1.1, 1],
                            boxShadow: [
                              '0 0 0 0 rgba(124, 58, 237, 0.4)',
                              '0 0 0 10px rgba(124, 58, 237, 0)'
                            ]
                          }
                        : {}
                    }
                    transition={{
                      duration: 1,
                      repeat: isNodeActive(1) ? Infinity : 0
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    1
                  </motion.div>

                  {/* Connection Lines */}
                  <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                    <svg
                      width='200'
                      height='120'
                      className='absolute -top-[50px]'
                      style={{ left: '-100px' }}
                    >
                      <motion.line
                        x1='100'
                        y1='20'
                        x2='40'
                        y2='80'
                        stroke='currentColor'
                        strokeWidth='2'
                        className={
                          isNodeActive(2) || isNodeVisited(2)
                            ? 'text-brand-primary'
                            : 'text-brand-border'
                        }
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                      />
                      <motion.line
                        x1='100'
                        y1='20'
                        x2='160'
                        y2='80'
                        stroke='currentColor'
                        strokeWidth='2'
                        className={
                          isNodeActive(3) || isNodeVisited(3)
                            ? 'text-brand-primary'
                            : 'text-brand-border'
                        }
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                      />
                    </svg>
                  </div>

                  {/* Child Nodes */}
                  <div className='mt-10 flex gap-20'>
                    <motion.div
                      className={`flex h-14 w-14 items-center justify-center rounded-full border-2 font-bold transition-all ${
                        isNodeActive(2)
                          ? 'border-brand-primary bg-brand-primary/60 ring-brand-primary/30 text-white ring-4'
                          : isNodeVisited(2)
                            ? 'border-brand-success bg-brand-success/40 text-white'
                            : 'border-brand-muted bg-brand-surface text-brand-muted'
                      }`}
                      animate={
                        isNodeActive(2)
                          ? {
                              scale: [1, 1.1, 1],
                              boxShadow: [
                                '0 0 0 0 rgba(124, 58, 237, 0.4)',
                                '0 0 0 10px rgba(124, 58, 237, 0)'
                              ]
                            }
                          : {}
                      }
                      transition={{
                        duration: 1,
                        repeat: isNodeActive(2) ? Infinity : 0
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      2
                    </motion.div>
                    <motion.div
                      className={`flex h-14 w-14 items-center justify-center rounded-full border-2 font-bold transition-all ${
                        isNodeActive(3)
                          ? 'border-brand-primary bg-brand-primary/60 ring-brand-primary/30 text-white ring-4'
                          : isNodeVisited(3)
                            ? 'border-brand-success bg-brand-success/40 text-white'
                            : 'border-brand-muted bg-brand-surface text-brand-muted'
                      }`}
                      animate={
                        isNodeActive(3)
                          ? {
                              scale: [1, 1.1, 1],
                              boxShadow: [
                                '0 0 0 0 rgba(124, 58, 237, 0.4)',
                                '0 0 0 10px rgba(124, 58, 237, 0)'
                              ]
                            }
                          : {}
                      }
                      transition={{
                        duration: 1,
                        repeat: isNodeActive(3) ? Infinity : 0
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      3
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Hero;
