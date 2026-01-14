import { useAuthContext } from '@/providers/AuthProvider';
import { UpdateEmailSchema, VerifyCodeSchema } from '@/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@algocanvas/ui/components/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@algocanvas/ui/components/field';
import { Input } from '@algocanvas/ui/components/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@algocanvas/ui/components/input-group';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@algocanvas/ui/components/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { MailIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

const UpdateEmail = () => {
  const { user } = useAuthContext();
  const [otpSend, setOtpSend] = useState(false);

  const updateEmailForm = useForm<z.infer<typeof UpdateEmailSchema>>({
    resolver: zodResolver(UpdateEmailSchema),
    defaultValues: {
      email: ''
    }
  });

  const verificationCodeForm = useForm<z.infer<typeof VerifyCodeSchema>>({
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues: {
      code: ''
    }
  });

  const onSubmit = (value: z.infer<typeof UpdateEmailSchema>) => {};

  const onVerificationCodeSubmit = (
    value: z.infer<typeof VerifyCodeSchema>
  ) => {};

  return (
    <div className='border-brand-border w-full rounded-md border p-8 shadow-lg'>
      <h1 className='text-brand-primary text-[28px] leading-[34px] font-extrabold tracking-[-0.416px]'>
        Update Email
      </h1>

      <div className='mt-6 flex max-w-2xl flex-col space-y-6'>
        {otpSend ? (
          <form
            className='space-y-6'
            id='verify-email-code-form'
            onSubmit={verificationCodeForm.handleSubmit(
              onVerificationCodeSubmit
            )}
          >
            <div className='rounded-lg border border-green-500/20 bg-green-500/5 p-4'>
              <p className='text-sm text-green-700 dark:text-green-400'>
                OTP has been sent to{' '}
                <span className='font-semibold'>test@gmail.com</span>
              </p>
            </div>
            <FieldGroup>
              <Controller
                name='code'
                control={verificationCodeForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Enter the code</FieldLabel>
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <div className='flex gap-3 pt-4'>
              <Button
                type='submit'
                className='bg-brand-primary hover:bg-brand-primary/80 cursor-pointer text-white'
              >
                Verify OTP
              </Button>
            </div>
          </form>
        ) : (
          <form
            className='space-y-6'
            id='update-email-form'
            onSubmit={updateEmailForm.handleSubmit(onSubmit)}
          >
            <div className='bg-sidebar-accent/30 border-sidebar-accent rounded-lg border p-4'>
              <p className='text-brand-primary mb-1 text-sm'>Current Email</p>
              <p className='text-base font-medium'>{user?.email}</p>
            </div>
            <FieldGroup>
              <Controller
                name='email'
                control={updateEmailForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>New Email Address</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type='email'
                        aria-invalid={fieldState.invalid}
                        autoComplete='email'
                        placeholder='Enter you new email'
                      />
                      <InputGroupAddon align='inline-start'>
                        <MailIcon />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>{' '}
            <div className='bg-sidebar-accent/50 border-sidebar-accent text-foreground/80 rounded-lg border p-4 text-sm'>
              <p>
                An OTP will be sent to your new email address for verification.
              </p>
            </div>
            <div className='flex gap-3 pt-4'>
              <Button
                type='submit'
                className='bg-brand-primary hover:bg-brand-primary/80 cursor-pointer text-white'
              >
                Send OTP
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateEmail;
