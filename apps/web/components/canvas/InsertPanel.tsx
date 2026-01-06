import { changeTool, toggleDialog } from '@/features/canvas/canvasSlice';
import { DSA_ELEMENTS } from '@/lib/canvas/constant';
import { useAppDispatch } from '@/store/hooks';
import {
  Command,
  CommandInput,
  CommandList,
  CommandSeparator,
  CommandGroup,
  CommandEmpty,
  CommandItem
} from '@workspace/ui/components/command';
import { User, CreditCard, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const InsertPanel = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useAppDispatch();

  const [value, setValue] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Command
      loop
      value={value}
      onValueChange={setValue}
      className='dark:bg-brand-bg absolute top-4 left-20 flex h-fit w-[350px] flex-col space-y-px rounded-md border p-3 shadow-md'
    >
      <CommandInput
        ref={inputRef}
        placeholder='search...'
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading='Data Structures'>
          {DSA_ELEMENTS.map((elem) => (
            <CommandItem
              key={elem.value}
              value={elem.value}
              onSelect={(value) => {
                dispatch(toggleDialog({ value: elem.value }));
                dispatch(changeTool({ tool: 'move' }));
              }}
            >
              {elem.icon && <elem.icon />}
              <span>{elem.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading='Icons'>
          <CommandItem>
            <User />
            <span>Profile</span>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>Billing</span>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default InsertPanel;
