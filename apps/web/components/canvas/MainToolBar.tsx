import { changeTool } from '@/features/canvas/canvasSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { MAIN_TOOLS } from '@/utils/canvas';
import { Button } from '@workspace/ui/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@workspace/ui/components/tooltip';
import { cn } from '@workspace/ui/lib/utils';
import { Settings } from 'lucide-react';

const MainToolBar = () => {
  const dispatch = useAppDispatch();
  const { tool } = useAppSelector((state) => state.canvas);

  return (
    <div className='dark:bg-brand-bg absolute top-4 left-4 flex flex-col space-y-px rounded-md'>
      {MAIN_TOOLS.map((toolItem) => (
        <Tooltip
          key={toolItem.name}
          delayDuration={toolItem.toolTipDelayDuration}
        >
          <TooltipTrigger asChild>
            <Button
              className={cn(
                'dark:bg-brand-bg dark:hover:bg-brand-primary relative size-11',
                tool === toolItem.toolType &&
                  'dark:bg-brand-primary bg-brand-primary'
              )}
              onClick={() => dispatch(changeTool({ tool: toolItem.toolType }))}
            >
              {toolItem.icon && (
                <toolItem.icon
                  className={cn(
                    'dark:text-neutral-400',
                    tool === toolItem.toolType && 'dark:text-neutral-200'
                  )}
                />
              )}
              <span
                className={cn(
                  'absolute right-2 bottom-1 text-[8px] text-neutral-400 uppercase',
                  tool === toolItem.toolType && 'dark:text-neutral-200'
                )}
              >
                {toolItem.keyboardShortCut}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side={toolItem.toolTipSide}>
            <p>{toolItem.toolTipContent}</p>
          </TooltipContent>
        </Tooltip>
      ))}
      <Tooltip delayDuration={1000}>
        <TooltipTrigger asChild>
          <Button className='dark:bg-brand-bg dark:hover:bg-brand-primary relative size-11'>
            <Settings className='dark:text-neutral-400' />
            <span
              className={cn(
                'absolute right-2 bottom-1 text-[8px] text-neutral-400 uppercase'
              )}
            >
              s
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side='left'>
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default MainToolBar;
