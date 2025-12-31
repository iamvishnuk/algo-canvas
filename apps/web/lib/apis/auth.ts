import { RegisterDTO } from '@/types/auth.type';
import API from '@/utils/axios-client';

export const registerUseMutaionFn = (data: RegisterDTO) =>
  API.post('/auth/register', data);

export const confirmAcccountMutationFn = (data: { code: string }) =>
  API.post('/auth/verify/email', data);
