import { revokeMfaMutationFn } from '@/lib/apis/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@algocanvas/ui/components/button';
import { Loader } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

const RevokeMfa = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: revokeMfaMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['authUser']
      });
      toast.success('Success', { description: 'MFA has been revoked' });
    },
    onError: (error) => {
      toast.error('Error', { description: error.message });
    }
  });

  const handleClick = useCallback(() => mutate(), []);
  return (
    <Button
      type='button'
      onClick={handleClick}
      disabled={isPending}
      className='mr-1 h-[35px] bg-red-700 text-white shadow-none hover:cursor-pointer hover:bg-red-800'
    >
      {isPending && <Loader className='animate-spin' />}
      Revoke Mfa
    </Button>
  );
};

export default RevokeMfa;
