export interface IUserPreferences {
  enable2FA: boolean;
  emailNotification: boolean;
  twoFactorSecret?: string;
}

export class UserPreferences implements IUserPreferences {
  private constructor(
    public enable2FA: boolean,
    public emailNotification: boolean,
    public twoFactorSecret?: string
  ) {}

  // ✅ Default preferences
  static create(data?: Partial<IUserPreferences>): UserPreferences {
    return new UserPreferences(
      data?.enable2FA ?? false,
      data?.emailNotification ?? true,
      data?.twoFactorSecret
    );
  }

  // ✅ Domain behavior
  isTwoFactorEnabled(): boolean {
    return this.enable2FA && !!this.twoFactorSecret;
  }

  // ✅ Immutable update
  enableTwoFactor(secret: string): UserPreferences {
    return new UserPreferences(true, this.emailNotification, secret);
  }

  disableTwoFactor(): UserPreferences {
    return new UserPreferences(false, this.emailNotification, undefined);
  }
}
