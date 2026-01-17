import { clearCanvas, undo, redo } from '@/features/canvas/canvasSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@algocanvas/ui/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@algocanvas/ui/components/tooltip';
import { Minus, Plus, Redo2, Trash, Undo2 } from 'lucide-react';

type BottomToolBarProps = {
  zoom: number;
  resetZoom?: () => void;
  zoomIn?: () => void;
  zoomOut?: () => void;
  clearCanvas?: () => void;
};

const BottomToolBar = ({
  zoom,
  resetZoom,
  zoomIn,
  zoomOut,
  clearCanvas
}: BottomToolBarProps) => {
  const dispatch = useAppDispatch();
  const { history } = useAppSelector((state) => state.canvas);

  return (
    <div className='absolute bottom-4 left-4 flex gap-4'>
      <div className='dark:bg-brand-bg flex gap-1 rounded-md border text-neutral-400'>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <Button
              className='dark:bg-brand-bg dark:hover:bg-brand-primary'
              size='icon'
              onClick={zoomIn}
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
              onClick={resetZoom}
            >
              {zoom}%
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
              onClick={zoomOut}
            >
              <Minus className='dark:text-neutral-400' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='top'>
            <p>Zoom out Ctrl--</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='dark:bg-brand-bg flex rounded-md border'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className='dark:bg-brand-bg dark:hover:bg-brand-primary'
              size='icon'
              onClick={() => dispatch(undo())}
              disabled={history.past.length === 0}
            >
              <Undo2 className='dark:text-neutral-400' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='top'>
            <p>Undo Ctrl+Z</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className='dark:bg-brand-bg dark:hover:bg-brand-primary'
              size='icon'
              onClick={() => dispatch(redo())}
              disabled={history.future.length === 0}
            >
              <Redo2 className='dark:text-neutral-400' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='top'>
            <p>Redo Ctrl+Shift+Z</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className='dark:bg-brand-bg flex rounded-md border'>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <Button
              className='dark:bg-brand-bg dark:hover:bg-red-800'
              size='icon'
              onClick={clearCanvas}
            >
              <Trash className='dark:text-neutral-400' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='top'>
            <p>Clear Canvas</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default BottomToolBar;
