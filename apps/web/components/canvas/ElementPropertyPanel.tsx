import { Ellipsis, Minus } from 'lucide-react';
import ColorPicker from './ColorPicker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { TOOL_PROPERTY_MAP } from '@/lib/canvas/constant';
import { PropertyKey, Tool } from '@workspace/types/canvas';
import { updateElementProperty } from '@/features/canvas/canvasSlice';
import {
  updateElementDefaultProperty,
  type IElementPropertyState
} from '@/features/element/elementPropertySlice';

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

const ElementPropertyPanel = () => {
  const dispatch = useAppDispatch();
  const elementProperty = useAppSelector((state) => state.elementProperty);
  const { tool, elements, selectedElementIndex } = useAppSelector(
    (state) => state.canvas
  );

  const selectedElement =
    selectedElementIndex !== null ? elements[selectedElementIndex] : null;

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
    if (selectedElementIndex !== null) {
      dispatch(
        updateElementProperty({
          propertyKey,
          value,
          index: selectedElementIndex
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

      {canShow('strokeStyle') && (
        <div className='space-y-2'>
          <p className='text-sm text-neutral-400'>Stroke Style</p>
          <div className='flex gap-2'>
            <div className='flex size-9 items-center justify-center rounded-md border text-xs shadow-md'>
              <Minus strokeWidth={1} />
            </div>
            <div className='flex size-9 items-center justify-center rounded-md border text-xs shadow-md'>
              ---
            </div>
            <div className='flex size-9 items-center justify-center rounded-md border text-xs shadow-md'>
              <Ellipsis strokeWidth={1} />
            </div>
          </div>
        </div>
      )}

      {canShow('fontFamily') && (
        <div className='space-y-2'>
          <p className='text-sm text-neutral-400'>Font Family</p>
          <div className=''>
            <select className='h-9 w-full rounded-md border px-2'>
              <option>Font 1</option>
              <option>Font 2</option>
              <option>Font 3</option>
              <option>Font 4</option>
            </select>
          </div>
        </div>
      )}

      {canShow('fontSize') && (
        <div className='space-y-2'>
          <p className='text-sm text-neutral-400'>Font Size</p>
          <div className='flex gap-2'>
            <div className='flex size-9 items-center justify-center rounded-md border text-xs shadow-md'>
              S
            </div>
            <div className='flex size-9 items-center justify-center rounded-md border text-xs shadow-md'>
              M
            </div>
            <div className='flex size-9 items-center justify-center rounded-md border text-xs shadow-md'>
              L
            </div>
            <div className='flex size-9 items-center justify-center rounded-md border text-xs shadow-md'>
              XL
            </div>
            <div className='flex size-9 items-center justify-center rounded-md border text-xs shadow-md'>
              2XL
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElementPropertyPanel;
