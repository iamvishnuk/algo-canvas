import { LoginDTO, LoginResponse, RegisterDTO } from '@/types/auth.type';
import { APIResponse } from '@/types/interface';
import API from '@/utils/axios-client';

export const registerUserMutaionFn = (data: RegisterDTO) =>
  API.post('/auth/register', data);

export const confirmAcccountMutationFn = (data: { code: string }) =>
  API.post('/auth/verify/email', data);

export const loginUserMutaionFn = (
  data: LoginDTO
): Promise<APIResponse<LoginResponse>> => API.post('/auth/login', data);
