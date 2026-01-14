import { addElements, toggleDialog } from '@/features/canvas/canvasSlice';
import { buildTreeFromArray } from '@/lib/data-structures/tree';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ArraySchema } from '@/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@algocanvas/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@algocanvas/ui/components/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@algocanvas/ui/components/field';
import { Input } from '@algocanvas/ui/components/input';
import { useForm, Controller } from 'react-hook-form';
import z from 'zod';

const TreeDialog = () => {
  const dispatch = useAppDispatch();
  const { showTreeDialog, view, size } = useAppSelector(
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

    if (value.length === 0) return;

    const root = buildTreeFromArray(values);
    if (!root) return;

    const centerX = (size.width / 2 - view.offsetX) / view.scale;
    const topY = (100 - view.offsetY) / view.scale;

    dispatch(
      addElements({
        element: {
          type: 'binary-tree',
          x: centerX,
          y: topY,
          root
        }
      })
    );

    form.reset();
    dispatch(toggleDialog({ value: 'binary-tree' }));
  };

  return (
    <Dialog
      onOpenChange={() => dispatch(toggleDialog({ value: 'binary-tree' }))}
      open={showTreeDialog}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-brand-primary text-xl font-bold'>
            Add Binary Tree
          </DialogTitle>
        </DialogHeader>
        <form
          id='binary-tree-form'
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
                    Enter array values (level-order, comma-separated)
                  </FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    type='text'
                    placeholder='e.g., 10, 5, 15, 3, 7, null, 20'
                  />
                  <FieldDescription>
                    Use{' '}
                    <span className='text-brand-primary font-bold'>null </span>
                    for empty node in level-order traversal
                  </FieldDescription>
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
              onClick={() => dispatch(toggleDialog({ value: 'binary-tree' }))}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              form='binary-tree-form'
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

export default TreeDialog;
