export interface APIResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface IUserPreferences {
  enable2FA: boolean;
  emailNotification: boolean;
  twoFactorSecret?: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  userPreferences: IUserPreferences;
  updatedAt?: Date;
  createdAt?: Date;
}
