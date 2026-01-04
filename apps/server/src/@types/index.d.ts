import 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      isEmailVerified: boolean;
      userPreferences: {
        enable2FA: boolean;
        emailNotification: boolean;
        twoFactorSecret?: string;
      };
      createdAt: Date;
      updatedAt: Date;
    }
    interface Request {
      sessionId?: string;
    }
  }
}
