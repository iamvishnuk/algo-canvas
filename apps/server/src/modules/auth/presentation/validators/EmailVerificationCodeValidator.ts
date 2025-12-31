import z from 'zod';

export const emailVerificationCodeSchema = z.object({
  code: z
    .string({ required_error: 'Verification code is required' })
    .min(1, { message: 'Verification code is required' })
});

export type TEmailVerificationCodeBody = z.infer<
  typeof emailVerificationCodeSchema
>;
