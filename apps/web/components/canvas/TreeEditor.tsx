import { Separator } from '@algocanvas/ui/components/separator';

const TreeEditor = () => {
  return (
    <div className='bg-brand-bg absolute top-4 right-4 flex max-h-[calc(100vh-50px)] max-w-[300px] min-w-[300px] flex-col space-y-5 rounded-md border p-4 shadow-md'>
      <div>
        <h3 className='text-brand-primary text-xl font-semibold'>Tree</h3>
        <Separator />
      </div>
    </div>
  );
};

export default TreeEditor;
