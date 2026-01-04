import { LoginDTO, LoginResponse, RegisterDTO } from '@/types/auth.type';
import {
  APIResponse,
  ISetupMfaRes,
  IVerifyMfa,
  IVerifyMfaAndLogin
} from '@/types/interface';
import API from '@/utils/axios-client';

export const registerUserMutaionFn = (data: RegisterDTO) =>
  API.post('/auth/register', data);

export const confirmAcccountMutationFn = (data: { code: string }) =>
  API.post('/auth/verify/email', data);

export const loginUserMutaionFn = (
  data: LoginDTO
): Promise<APIResponse<LoginResponse>> => API.post('/auth/login', data);

export const setUpMfaMutationFn = async (): Promise<
  APIResponse<ISetupMfaRes>
> => await API.get('/auth/mfa/setup');

export const verifyMafMutationFn = async (data: IVerifyMfa) =>
  await API.post('/auth/mfa/verify', data);

export const revokeMfaMutationFn = async () =>
  await API.put('/auth/mfa/revoke');

export const verifyMfaAndLoginMutationFn = async (data: IVerifyMfaAndLogin) =>
  await API.post('/auth/mfa/verify-login', data);
