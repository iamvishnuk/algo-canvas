import { Separator } from '@workspace/ui/components/separator';
import { cn } from '@workspace/ui/lib/utils';
import { useState } from 'react';
import { HexAlphaColorPicker, HexColorInput } from 'react-colorful';

const DEFAULT_COLORS = [
  '#7A3EFF',
  '#9D8CFF',
  '#60A5FA',
  '#34D399',
  '#C4B5FD',
  '#E5E7EB'
];

type Props = {
  currentColor: string;
  onColorChange: (color: string) => void;
  colors?: string[];
};

const ColorPicker = ({
  currentColor,
  onColorChange,
  colors = DEFAULT_COLORS
}: Props) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  return (
    <div className='space-y-3'>
      <div className='flex gap-2'>
        {colors.map((clr) => (
          <div
            key={clr}
            className={cn(
              'size-8 rounded-md shadow-md hover:cursor-pointer',
              clr === currentColor && 'border border-black dark:border-white'
            )}
            style={{ background: clr }}
            onClick={() => onColorChange(clr)}
          />
        ))}
        <Separator
          orientation='vertical'
          className='!h-8'
        />
        <div
          onClick={() => setShowColorPicker(!showColorPicker)}
          className='size-8 rounded-md shadow-md hover:cursor-pointer'
          style={{ background: currentColor }}
        />
      </div>
      {showColorPicker && (
        <div className='mt-5 flex flex-col items-center justify-center'>
          <HexAlphaColorPicker
            color={currentColor}
            onChange={(newColor) => {
              onColorChange(newColor);
            }}
            className='shadow-md'
          />
          <div className='mt-4'>
            <p className='text-sm text-neutral-400'>Hex code</p>
            <HexColorInput
              color={currentColor}
              onChange={(newColor) => {
                onColorChange(newColor);
              }}
              className='mt-2 h-[40px] w-[190px] rounded-md border border-black px-3 text-lg text-black dark:border-white dark:text-white'
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
