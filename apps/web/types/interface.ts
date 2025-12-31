export interface APIResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
  };
}
