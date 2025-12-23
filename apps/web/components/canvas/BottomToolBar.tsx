import {
  clearCanvas,
  handleZoom,
  resetView
} from '@/features/canvas/canvasSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@workspace/ui/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@workspace/ui/components/tooltip';
import { Minus, Plus, Redo2, Trash, Undo2 } from 'lucide-react';

const BottomToolBar = () => {
  const dispatch = useAppDispatch();
  const view = useAppSelector((state) => state.canvas.view);

  return (
    <div className='absolute bottom-4 left-4 flex gap-4'>
      <div className='dark:bg-brand-bg flex gap-1 rounded-md text-neutral-400'>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <Button
              className='dark:bg-brand-bg dark:hover:bg-brand-primary'
              size='icon'
              onClick={() => dispatch(handleZoom({ delta: -0.1 }))}
            >
              <Plus className='dark:text-neutral-400' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='top'>
            <p>Zoom in Ctrl++</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <div
              className='flex cursor-pointer items-center justify-center text-xs'
              onClick={() => dispatch(resetView())}
            >
              {Math.round(view.scale * 100)}%
            </div>
          </TooltipTrigger>
          <TooltipContent side='top'>
            <p>Reset zoom</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <Button
              className='dark:bg-brand-bg dark:hover:bg-brand-primary'
              size='icon'
              onClick={() => dispatch(handleZoom({ delta: 0.1 }))}
            >
              <Minus className='dark:text-neutral-400' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='top'>
            <p>Zoom out Ctrl--</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='dark:bg-brand-bg flex rounded-md'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className='dark:bg-brand-bg dark:hover:bg-brand-primary'
              size='icon'
            >
              <Undo2 className='dark:text-neutral-400' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='top'>
            <p>Undo</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className='dark:bg-brand-bg dark:hover:bg-brand-primary'
              size='icon'
            >
              <Redo2 className='dark:text-neutral-400' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='top'>
            <p>Redo</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='dark:bg-brand-bg flex rounded-md'>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <Button
              className='dark:bg-brand-bg dark:hover:bg-red-800'
              size='icon'
              onClick={() => dispatch(clearCanvas())}
            >
              <Trash className='dark:text-neutral-400' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='top'>
            <p>Clear</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default BottomToolBar;
