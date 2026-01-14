'use client';

import { verifyMfaAndLoginMutationFn } from '@/lib/apis/auth';
import { MfaVerifySchema } from '@/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@algocanvas/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@algocanvas/ui/components/card';
import { Field, FieldGroup, FieldLabel } from '@algocanvas/ui/components/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@algocanvas/ui/components/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Loader } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const VerifyMfaForm = () => {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get('email');

  const form = useForm<z.infer<typeof MfaVerifySchema>>({
    resolver: zodResolver(MfaVerifySchema),
    defaultValues: {
      pin: ''
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: verifyMfaAndLoginMutationFn
  });

  const onSubmit = async (values: z.infer<typeof MfaVerifySchema>) => {
    if (!email) {
      toast.error('Error', { description: 'Something went wrong, try again' });
      router.push('/login');
      return;
    }
    const data = {
      code: values.pin,
      email: email!
    };
    mutate(data, {
      onSuccess: () => {
        toast.success('Success', {
          description: 'MFA has been verified successfully'
        });
        router.push('/dashboard');
      },
      onError: (error) => {
        toast.error('Error', { description: error.message });
      }
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Factor Authentication</CardTitle>
        <CardDescription>
          Enter the code from your authenticator app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id='mfa-verify-form'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name='pin'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputOTP
                    className='flex items-center !text-lg'
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    {...field}
                    style={{ justifyContent: 'center' }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className='!h-12 !w-14 !text-lg'
                      />
                      <InputOTPSlot
                        index={1}
                        className='!h-12 !w-14 !text-lg'
                      />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={2}
                        className='!h-12 !w-14 !text-lg'
                      />
                      <InputOTPSlot
                        index={3}
                        className='!h-12 !w-14 !text-lg'
                      />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={4}
                        className='!h-12 !w-14 !text-lg'
                      />
                      <InputOTPSlot
                        index={5}
                        className='!h-12 !w-14 !text-lg'
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type='submit'
          form='mfa-verify-form'
          className='bg-brand-primary/70 hover:bg-brand-primary/80 text-brand-text hover:cursor-pointer'
          disabled={isPending}
        >
          {isPending && <Loader className='animate-spin' />}
          Verify
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerifyMfaForm;
