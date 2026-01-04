import z from 'zod';

export const mfaLoginSchema = z.object({
  code: z
    .string({ required_error: 'Code is required' })
    .trim()
    .min(1, { message: 'Code is required' }),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'Invalid email' })
});

export type IMfaLoginBody = z.infer<typeof mfaLoginSchema>;
