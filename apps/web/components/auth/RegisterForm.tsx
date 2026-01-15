'use client';
import { registerSchema } from '@/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import z from 'zod';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@algocanvas/ui/components/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@algocanvas/ui/components/field';
import { Input } from '@algocanvas/ui/components/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@algocanvas/ui/components/input-group';
import { ArrowRight, Eye, EyeOff, Loader, MailCheckIcon } from 'lucide-react';
import { Button } from '@algocanvas/ui/components/button';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { registerUserMutationFn } from '@/lib/apis/auth';
import { toast } from 'sonner';
import GoogleLogin from './GoogleLogin';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerUserMutationFn
  });

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    const { confirmPassword, ...payload } = data;

    mutate(payload, {
      onSuccess: () => {
        toast.success('Registration successful 🎉', {
          description: "We,'ve send a verification link to your email"
        });
        setIsSubmitted(true);
      },
      onError: (error) => {
        toast.error('Error', { description: error.message });
      }
    });
  };

  return (
    <div className='flex flex-col gap-6'>
      {!isSubmitted ? (
        <Card className='bg-brand-surface'>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              id='login-form'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <Controller
                  name='name'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Name</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        type='text'
                        placeholder='John'
                        autoComplete='name'
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name='email'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        type='email'
                        placeholder='example@gmail.com'
                        autoComplete='email'
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name='password'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Password</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          aria-invalid={fieldState.invalid}
                          type={showPassword ? 'text' : 'password'}
                          autoComplete='new-password'
                          placeholder='********'
                        />
                        <InputGroupAddon align='inline-end'>
                          <InputGroupButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <Eye /> : <EyeOff />}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name='confirmPassword'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Confirm Password</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          aria-invalid={fieldState.invalid}
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder='********'
                        />
                        <InputGroupAddon align='inline-end'>
                          <InputGroupButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showPassword ? <Eye /> : <EyeOff />}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field>
              <Button
                type='submit'
                form='login-form'
                className='bg-purple-500 text-white shadow-md shadow-purple-500/30 transition hover:bg-violet-600'
                disabled={isPending}
              >
                {isPending && <Loader className='animate-spin' />}
                Create Account
              </Button>
              <GoogleLogin />
              <FieldDescription className='text-center'>
                Already have an account? <Link href='/sign-in'>Sign in</Link>
              </FieldDescription>
            </Field>
          </CardFooter>
        </Card>
      ) : (
        <Card className='flex flex-col items-center py-8'>
          <div>
            <MailCheckIcon
              size={42}
              className='animate-bounce text-purple-500'
            />
          </div>

          <h2 className='text-xl font-bold tracking-[-0.16px] dark:text-[#fcfdffef]'>
            Check your email
          </h2>
          <p className='text-center text-sm font-normal dark:text-[#f1f7feb5]'>
            We just sent a verification link to {form.getValues('email')}.
          </p>
          <Link href='/sign-in'>
            <Button className='bg-purple-500 text-white shadow-md shadow-purple-500/30 transition hover:bg-violet-600'>
              Go to login
              <ArrowRight />
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default RegisterForm;
