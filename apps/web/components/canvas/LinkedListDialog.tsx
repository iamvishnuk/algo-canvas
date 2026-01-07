import { addElements, toggleDialog } from '@/features/canvas/canvasSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ArraySchema } from '@/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@workspace/ui/components/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { useForm, Controller } from 'react-hook-form';
import z from 'zod';

const LinkedListDialog = () => {
  const dispatch = useAppDispatch();

  const { showLinkedListDialog, view, size } = useAppSelector(
    (state) => state.canvas
  );

  const form = useForm<z.infer<typeof ArraySchema>>({
    resolver: zodResolver(ArraySchema),
    defaultValues: {
      value: ''
    }
  });

  const onSubmit = (data: z.infer<typeof ArraySchema>) => {
    const { value } = data;
    const values = value
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v !== '');

    const centerX = (size.width / 2 - view.offsetX) / view.scale;
    const topY = (100 - view.offsetY) / view.scale;

    dispatch(
      addElements({
        element: {
          type: 'linked-list',
          x: centerX,
          y: topY,
          values
        }
      })
    );

    form.reset();
    dispatch(toggleDialog({ value: 'linked-list' }));
  };

  return (
    <Dialog
      open={showLinkedListDialog}
      onOpenChange={() => dispatch(toggleDialog({ value: 'linked-list' }))}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-brand-primary text-xl font-bold'>
            Add Linked List
          </DialogTitle>
        </DialogHeader>
        <form
          id='array-form'
          className='mt-3 space-y-3'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name='value'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className='text-white'>
                    Enter linked list values (comma-separated)
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    type='text'
                    placeholder='e.g.,1, 2, 3, 4, 5'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Field orientation='horizontal'>
            <Button
              type='button'
              className='bg-red-700 text-white hover:cursor-pointer hover:bg-red-800'
              onClick={() => dispatch(toggleDialog({ value: 'linked-list' }))}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              form='array-form'
              className='bg-brand-primary hover:bg-brand-primary/90 text-white hover:cursor-pointer'
            >
              Submit
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkedListDialog;
