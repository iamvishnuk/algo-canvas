import { UpdatePasswordSchema } from '@/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@algocanvas/ui/components/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@algocanvas/ui/components/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@algocanvas/ui/components/input-group';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import z from 'zod';

const PasswordCard = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
    mode: 'onChange',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = (values: z.infer<typeof UpdatePasswordSchema>) => {};

  return (
    <div className='border-brand-border w-full rounded-md border p-8 shadow-lg'>
      <h1 className='text-brand-primary text-[28px] leading-[34px] font-extrabold tracking-[-0.416px]'>
        Change Password
      </h1>
      <p className='text-brand-text mt-2'>
        Keep your account secure by using a strong password.
      </p>

      <form
        className='mt-10 space-y-6'
        id='update-password-form'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            name='oldPassword'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Old Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    aria-invalid={fieldState.invalid}
                    type={showOldPassword ? 'text' : 'password'}
                    autoComplete='new-password'
                    placeholder='********'
                  />
                  <InputGroupAddon align='inline-end'>
                    <InputGroupButton
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? <Eye /> : <EyeOff />}
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
            name='newPassword'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>New Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    aria-invalid={fieldState.invalid}
                    type={showNewPassword ? 'text' : 'password'}
                    autoComplete='new-password'
                    placeholder='********'
                  />
                  <InputGroupAddon align='inline-end'>
                    <InputGroupButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <Eye /> : <EyeOff />}
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
                    autoComplete='new-password'
                    placeholder='********'
                  />
                  <InputGroupAddon align='inline-end'>
                    <InputGroupButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <Eye /> : <EyeOff />}
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
        <div className='flex gap-3 pt-4'>
          <Button
            type='submit'
            className='bg-brand-primary hover:bg-brand-primary/80 cursor-pointer text-white'
          >
            Send OTP
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordCard;
