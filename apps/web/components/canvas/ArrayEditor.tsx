import { Separator } from '@algocanvas/ui/components/separator';
import { useState, useEffect } from 'react';
import { Button } from '@algocanvas/ui/components/button';
import { ArrowDown, ArrowUp, Check, Copy, Trash } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@algocanvas/ui/components/tooltip';
import { CanvasElement } from '@algocanvas/types/canvas';
import { CanvasEngine } from '@/canvas-engine';

type ArrayEditorProps = {
  selectedElement: CanvasElement | null;
  engine: CanvasEngine | null;
};

const ArrayEditor = ({ selectedElement, engine }: ArrayEditorProps) => {
  const elementType = selectedElement?.type;

  const [initialValues, setInitialValues] = useState<string[]>(
    selectedElement?.type === 'array' ? selectedElement.values : []
  );

  // Sync local state with selected element's value when it changes
  useEffect(() => {
    if (selectedElement?.type === 'array') {
      setInitialValues(selectedElement.values);
    } else {
      setInitialValues([]);
    }
  }, [selectedElement]);

  const [newValue, setNewValue] = useState('');
  const [editingValue, setEditingValue] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const append = (value: string) => {
    if (value.trim() === '') return;
    setInitialValues((prev) => [...prev, value]);
    setNewValue('');
    engine?.updateDataStructuresValues([...initialValues, value]);
  };

  const prepend = (value: string) => {
    if (value.trim() === '') return;
    setInitialValues((prev) => [value, ...prev]);
    setNewValue('');
    engine?.updateDataStructuresValues([value, ...initialValues]);
  };

  const remove = (index: number) => {
    const updatedValue = initialValues.filter((_, idx) => idx !== index);
    setInitialValues(updatedValue);
    engine?.updateDataStructuresValues(updatedValue);
  };

  const startEdit = (index: number, currentValue: string) => {
    setEditingIndex(index);
    setEditingValue(currentValue);
  };

  const saveEdit = (index: number) => {
    if (editingValue.trim() === '') {
      setEditingIndex(null);
      setEditingValue('');
      return;
    }

    setInitialValues((prev) =>
      prev.map((val, idx) => (idx === index ? editingValue : val))
    );
    engine?.updateDataStructuresValues(
      initialValues.map((val, idx) => (idx === index ? editingValue : val))
    );
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleSort = (isAsc: boolean) => {
    const areNumbers = initialValues.every((val) => !isNaN(Number(val)));
    let sortedValues: string[] = [];

    if (areNumbers) {
      if (isAsc) {
        sortedValues = [...initialValues].sort((a, b) => Number(a) - Number(b));
      } else {
        sortedValues = [...initialValues].sort((a, b) => Number(b) - Number(a));
      }
    } else {
      sortedValues = [...initialValues].sort();
    }

    setInitialValues(sortedValues);
    engine?.updateDataStructuresValues(sortedValues);
  };

  if (elementType !== 'array') {
    return null;
  }

  return (
    <div className='bg-brand-bg absolute top-4 right-4 flex max-h-[calc(100vh-50px)] max-w-[300px] min-w-[300px] flex-col space-y-5 rounded-md border p-4 shadow-md'>
      <div className=''>
        <h3 className='text-brand-primary text-xl font-semibold'>Array</h3>
        <Separator className='my-2' />
        <div>
          <p className='text-sm text-neutral-400'>Values</p>
          <div className='mt-3 max-h-[calc(100vh-400px)] space-y-2 overflow-y-auto'>
            {initialValues.map((value, index) => (
              <div
                className='flex justify-between gap-2'
                key={index}
              >
                <div className='flex gap-2'>
                  <div className='flex h-full w-[40px] items-center justify-center rounded-md border text-xs'>
                    {index}
                  </div>
                  <input
                    className='h-full w-[130px] rounded-md border px-2'
                    value={editingIndex === index ? editingValue : value}
                    onChange={(e) => {
                      if (editingIndex !== index) {
                        startEdit(index, e.target.value);
                      } else {
                        setEditingValue(e.target.value);
                      }
                    }}
                    onFocus={() => startEdit(index, value)}
                  />
                </div>
                <div className='flex gap-2'>
                  <Button
                    size={'icon'}
                    className='bg-brand-primary hover:bg-brand-primary/90 text-white hover:cursor-pointer'
                    onClick={() => saveEdit(index)}
                    disabled={index !== editingIndex}
                  >
                    <Check />
                  </Button>
                  <Button
                    size={'icon'}
                    variant={'destructive'}
                    className='hover:cursor-pointer'
                    onClick={() => remove(index)}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Separator className='my-2' />
        <div>
          <p className='text-sm text-neutral-400'>Operations</p>
          <div className='mt-3 space-y-2'>
            <div className='grid grid-cols-4 gap-2'>
              <div className='col-span-2'>
                <input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className='h-full w-full rounded-md border px-2 focus:outline-none'
                />
              </div>
              <Button
                className='bg-brand-primary hover:bg-brand-primary/90 text-xs text-white hover:cursor-pointer'
                onClick={() => append(newValue)}
              >
                Append
              </Button>
              <Button
                className='bg-brand-primary hover:bg-brand-primary/90 text-xs text-white hover:cursor-pointer'
                onClick={() => prepend(newValue)}
              >
                Prepend
              </Button>
            </div>
            <Separator className='my-2' />
            <div className='grid grid-cols-3 gap-2'>
              <Button
                className='bg-brand-primary hover:bg-brand-primary/90 text-xs text-white hover:cursor-pointer'
                onClick={() => handleSort(true)}
              >
                Sort
                <ArrowUp
                  size={10}
                  className='-ml-2'
                />
              </Button>
              <Button
                className='bg-brand-primary hover:bg-brand-primary/90 text-xs text-white hover:cursor-pointer'
                onClick={() => handleSort(false)}
              >
                Sort
                <ArrowDown
                  size={10}
                  className='-ml-2'
                />
              </Button>
            </div>
          </div>
        </div>
        <Separator className='my-2' />
        <div>
          <p className='text-sm text-neutral-400'>Actions</p>
          <div className='mt-3 flex gap-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={'icon'}
                  variant={'outline'}
                  className='hover:cursor-pointer'
                  onClick={() => engine?.removeElement()}
                >
                  <Trash />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={'icon'}
                  variant={'outline'}
                  className='hover:cursor-pointer'
                  onClick={() => engine?.duplicateElement()}
                >
                  <Copy />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>
                <p>Duplicate</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrayEditor;
