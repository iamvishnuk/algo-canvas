'use client';
import { confirmAcccountMutationFn } from '@/lib/apis/auth';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { Loader } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MouseEvent } from 'react';
import { toast } from 'sonner';

const ConfirmAccount = () => {
  const params = useSearchParams();
  const router = useRouter();

  const code = params.get('code');

  const { mutate, isPending } = useMutation({
    mutationFn: confirmAcccountMutationFn
  });

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (!code) {
      toast.error('Error', {
        description: 'Invalid verification link Please try again later'
      });
    }
    mutate(
      { code: code! },
      {
        onSuccess: () => {
          toast.success('Account confirmed successfully');
          router.push('/sign-in');
        },
        onError: (error) => {
          toast.error('Error', { description: error.message });
        }
      }
    );
  };

  return (
    <Card className='bg-brand-surface'>
      <CardHeader>
        <CardTitle>Account Confirmation</CardTitle>
        <CardDescription>
          To confirm your account, please follow the button below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          type='submit'
          form='login-form'
          className='w-full bg-purple-500 text-white shadow-md shadow-purple-500/30 transition hover:bg-violet-600'
          disabled={isPending}
          onClick={handleSubmit}
        >
          {isPending && <Loader className='animate-spin' />}
          Confirm account
        </Button>
      </CardContent>
      <CardFooter>
        <p className='text-sm font-normal dark:text-[#f1f7feb5]'>
          If you have any issue confirming your account please, contact{' '}
          <a
            className='focus-visible:ring-primary text-blue-500 transition duration-150 ease-in-out outline-none hover:underline focus-visible:ring-2'
            href='#'
          >
            support@example.com
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  );
};

export default ConfirmAccount;
