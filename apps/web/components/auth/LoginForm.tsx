'use client';
import { loginSchema } from '@/validators';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@workspace/ui/components/input-group';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { GoogleLogoIcon } from '@phosphor-icons/react';
import Link from 'next/link';

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    console.log({ data });
  };
  return (
    <div className='flex flex-col gap-6'>
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
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
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
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field>
            <Button
              type='submit'
              form='login-form'
              className='bg-purple-500 text-white shadow-md shadow-purple-500/30 transition hover:bg-violet-600'
            >
              Login
            </Button>
            <Button variant='outline'>
              <GoogleLogoIcon />
              Login With Google
            </Button>
            <FieldDescription className='text-center'>
              Don&apos;t have an account? <Link href='sign-up'>Sign up</Link>
            </FieldDescription>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}

export default LoginForm;
