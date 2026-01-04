import z from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .transform((val) => val.trim())
      .pipe(
        z
          .string()
          .min(1, { message: 'Name must have atleast 1 character' })
          .max(30, { message: 'Name must have atmost 30 characters' })
      ),
    email: z
      .string({ required_error: 'Email is required' })
      .transform((val) => val.trim())
      .transform((val) => val.toLocaleLowerCase())
      .pipe(z.string().email({ message: 'Invalid email' })),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Password must have at least 8 characters' })
      .max(255, { message: 'Password must have at most 255 characters' })
      .refine((password) => /[A-Z]/.test(password), {
        message: 'Password must contain at least one uppercase letter'
      })
      .refine((password) => /[a-z]/.test(password), {
        message: 'Password must contain at least one lowercase letter'
      })
      .refine((password) => /[0-9]/.test(password), {
        message: 'Password must contain at least one number'
      })
      .refine((password) => /[^A-Za-z0-9]/.test(password), {
        message: 'Password must contain at least one special character'
      }),
    confirmPassword: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Passwrod must have at least 8 characters' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword']
  });

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .transform((val) => val.trim())
    .transform((val) => val.toLocaleLowerCase())
    .pipe(z.string().email({ message: 'Invalid email' })),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must have at least 8 characters' })
    .max(255, { message: 'Password must have at most 255 characters' })
    .refine((password) => /[A-Z]/.test(password), {
      message: 'Password must contain at least one uppercase letter'
    })
    .refine((password) => /[a-z]/.test(password), {
      message: 'Password must contain at least one lowercase letter'
    })
    .refine((password) => /[0-9]/.test(password), {
      message: 'Password must contain at least one number'
    })
    .refine((password) => /[^A-Za-z0-9]/.test(password), {
      message: 'Password must contain at least one special character'
    })
});

export const MfaVerifySchema = z.object({
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.'
  })
});
