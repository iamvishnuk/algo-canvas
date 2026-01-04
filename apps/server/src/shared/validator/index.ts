import z from 'zod';

export const IdSchema = z.object({
  id: z
    .string({ required_error: 'Id is required' })
    .trim()
    .min(1, { message: 'Id is required' })
    .max(24, { message: 'Valid is required' })
});
