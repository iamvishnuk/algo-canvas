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

export interface ISession {
  _id: string;
  userAgent: string;
  userId: string;
  createdAt: Date;
  expiredAt: Date;
  isCurrent: boolean;
}

export interface ISetupMfaRes {
  secret: string;
  qrImageUrl: string;
}

export interface IVerifyMfa {
  code: string;
  secretKey: string;
}

export interface IVerifyMfaAndLogin {
  code: string;
  email: string;
}
