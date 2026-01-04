import z from 'zod';

export const verifyMfaSetupSchema = z.object({
  code: z
    .string({ required_error: 'Code is required' })
    .trim()
    .min(1, { message: 'Code is required' }),
  secretKey: z
    .string({ required_error: 'Secret ky is required' })
    .trim()
    .min(1, { message: 'Secret key is required' })
});

export type TVerifyMfaSetupBody = z.infer<typeof verifyMfaSetupSchema>;
