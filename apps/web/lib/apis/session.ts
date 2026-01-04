import { APIResponse, ISession, IUser } from '@/types/interface';
import API from '@/utils/axios-client';

export const getCurrentSessionMutationFn = async (): Promise<
  APIResponse<IUser>
> => await API.get('/session/current');

export const getAllSessionsMutationFn = async (): Promise<
  APIResponse<ISession[]>
> => await API.get('/session/all');

export const deleteSessionMutationFn = async (sessionId: string) =>
  await API.delete(`/session/${sessionId}`);
