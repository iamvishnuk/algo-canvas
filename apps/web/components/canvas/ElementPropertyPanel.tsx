import { Ellipsis, Minus } from 'lucide-react';
import ColorPicker from './ColorPicker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { TOOL_PROPERTY_MAP } from '@/lib/canvas/constant';
import { PropertyKey, StrokePattern, Tool } from '@algocanvas/types/canvas';
import { updateElementProperty } from '@/features/canvas/canvasSlice';
import {
  updateElementDefaultProperty,
  type IElementPropertyState
} from '@/features/element/elementPropertySlice';

const STROKE_PATTERNS: {
  value: StrokePattern;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: 'solid', label: 'Solid', icon: <Minus strokeWidth={2} /> },
  {
    value: 'dashed',
    label: 'Dashed',
    icon: <span className='text-[10px]'>---</span>
  },
  { value: 'dotted', label: 'Dotted', icon: <Ellipsis strokeWidth={2} /> }
];

const STROKE_COLORS = [
  '#7A3EFF',
  '#9D8CFF',
  '#60A5FA',
  '#34D399',
  '#C4B5FD',
  '#E5E7EB'
];

const BACKGROUND_COLORS = [
  'transparent',
  '#7A3EFF33',
  '#9D8CFF33',
  '#60A5FA33',
  '#34D39933',
  '#C4B5FD33'
];

const FONT_FAMILIES = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Fira Code', label: 'Fira Code' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Caveat', label: 'Caveat' }
];

const FONT_SIZES = [
  { value: 16, label: 'S' },
  { value: 20, label: 'M' },
  { value: 28, label: 'L' },
  { value: 36, label: 'XL' },
  { value: 48, label: '2XL' }
];

const ElementPropertyPanel = () => {
  const dispatch = useAppDispatch();
  const elementProperty = useAppSelector((state) => state.elementProperty);
  const { tool, elements, selectedElementId } = useAppSelector(
    (state) => state.canvas
  );

  const selectedElement =
    selectedElementId !== null
      ? elements.find((el) => el.id === selectedElementId)
      : null;

  const activeType = selectedElement?.type ?? tool;

  const visibleProperties = TOOL_PROPERTY_MAP[activeType as Tool] ?? [];

  const canShow = (key: PropertyKey) => visibleProperties.includes(key);

  // Get the element key for default property updates
  const getElementKey = (): keyof IElementPropertyState | null => {
    switch (activeType) {
      case 'rectangle':
        return 'rectangle';
      case 'circle':
        return 'circle';
      case 'line':
        return 'line';
      case 'arrow':
        return 'arrow';
      case 'draw':
        return 'draw';
      case 'text':
        return 'text';
      default:
        return null;
    }
  };

  // Get current properties based on active element type
  const getCurrentProperties = () => {
    const elementKey = getElementKey();
    if (elementKey) {
      return elementProperty[elementKey];
    }
    return elementProperty.rectangle;
  };

  const currentProps = getCurrentProperties();

  // Helper to safely get property value - prefer selected element's value, fallback to defaults
  const getPropertyValue = (key: PropertyKey, defaultValue: string): string => {
    // If an element is selected, use its actual property value
    if (selectedElement && key in selectedElement) {
      const value = (selectedElement as Record<string, unknown>)[key];
      if (typeof value === 'string') {
        return value;
      }
    }
    // Fallback to default properties from elementProperty slice
    if (key in currentProps) {
      return (
        ((currentProps as Record<string, unknown>)[key] as string) ??
        defaultValue
      );
    }
    return defaultValue;
  };

  // Helper to get numeric property value
  const getNumericPropertyValue = (
    key: PropertyKey,
    defaultValue: number
  ): number => {
    if (selectedElement && key in selectedElement) {
      const value = (selectedElement as Record<string, unknown>)[key];
      if (typeof value === 'number') {
        return value;
      }
    }
    if (key in currentProps) {
      const value = (currentProps as Record<string, unknown>)[key];
      if (typeof value === 'number') {
        return value;
      }
    }

    return defaultValue;
  };

  // Handle property change - updates element if selected, otherwise updates defaults
  const handlePropertyChange = (
    propertyKey: PropertyKey,
    value: string | number
  ) => {
    if (selectedElementId !== null) {
      dispatch(
        updateElementProperty({
          propertyKey,
          value
        })
      );
    } else {
      const elementKey = getElementKey();
      if (elementKey) {
        dispatch(
          updateElementDefaultProperty({
            element: elementKey,
            key: propertyKey,
            value
          })
        );
      }
    }
  };

  if (visibleProperties.length === 0) return null;

  return (
    <div className='bg-brand-bg absolute top-4 right-4 flex min-w-[250px] flex-col space-y-5 rounded-md border p-4 shadow-md'>
      {canShow('strokeStyle') && (
        <div className='space-y-2'>
          <p className='text-sm text-neutral-400'>Stroke color</p>
          <ColorPicker
            currentColor={getPropertyValue('strokeStyle', '#7A3EFF')}
            onColorChange={(color) =>
              handlePropertyChange('strokeStyle', color)
            }
            colors={STROKE_COLORS}
          />
        </div>
      )}

      {canShow('fillStyle') && (
        <div className='space-y-2'>
          <p className='text-sm text-neutral-400'>Background</p>
          <ColorPicker
            currentColor={getPropertyValue('fillStyle', 'transparent')}
            onColorChange={(color) => handlePropertyChange('fillStyle', color)}
            colors={BACKGROUND_COLORS}
          />
        </div>
      )}

      {canShow('color') && (
        <div className='space-y-2'>
          <p className='text-sm text-neutral-400'>Text Color</p>
          <ColorPicker
            currentColor={getPropertyValue('color', '#7A3EFF')}
            onColorChange={(color) => handlePropertyChange('color', color)}
            colors={STROKE_COLORS}
          />
        </div>
      )}

      {canShow('lineWidth') && (
        <div className='space-y-2'>
          <p className='text-sm text-neutral-400'>Stroke Width</p>
          <div className='flex gap-2'>
            {[2, 4, 6, 8, 10].map((width) => (
              <button
                key={width}
                onClick={() => handlePropertyChange('lineWidth', width)}
                className={`flex size-9 items-center justify-center rounded-md border text-xs shadow-md transition-colors ${
                  getNumericPropertyValue('lineWidth', 2) === width
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'hover:bg-neutral-800'
                }`}
              >
                {width}
              </button>
            ))}
          </div>
        </div>
      )}

      {canShow('strokePattern') && (
        <div className='space-y-2'>
          <p className='text-sm text-neutral-400'>Stroke Style</p>
          <div className='flex gap-2'>
            {STROKE_PATTERNS.map((pattern) => (
              <button
                key={pattern.value}
                onClick={() =>
                  handlePropertyChange('strokePattern', pattern.value)
                }
                className={`flex size-9 items-center justify-center rounded-md border text-xs shadow-md transition-colors ${
                  getPropertyValue('strokePattern', 'solid') === pattern.value
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'hover:bg-neutral-800'
                }`}
                title={pattern.label}
              >
                {pattern.icon}
              </button>
            ))}
          </div>
        </div>
      )}

      {canShow('fontFamily') && (
        <div className='space-y-2'>
          <p className='text-sm text-neutral-400'>Font Family</p>
          <div>
            <select
              value={getPropertyValue('fontFamily', 'Caveat')}
              onChange={(e) =>
                handlePropertyChange('fontFamily', e.target.value)
              }
              className='bg-brand-bg h-9 w-full cursor-pointer rounded-md border px-2 text-sm text-white focus:border-purple-500 focus:outline-none'
            >
              {FONT_FAMILIES.map((font) => (
                <option
                  key={font.value}
                  value={font.value}
                >
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {canShow('fontSize') && (
        <div className='space-y-2'>
          <p className='text-sm text-neutral-400'>Font Size</p>
          <div className='flex gap-2'>
            {FONT_SIZES.map((size) => (
              <button
                key={size.value}
                onClick={() => handlePropertyChange('fontSize', size.value)}
                className={`flex size-9 items-center justify-center rounded-md border text-xs shadow-md transition-colors ${
                  getNumericPropertyValue('fontSize', 28) === size.value
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'hover:bg-neutral-800'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ElementPropertyPanel;
