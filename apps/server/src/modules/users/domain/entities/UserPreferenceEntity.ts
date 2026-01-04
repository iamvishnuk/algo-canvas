export interface IUserPreferences {
  enable2FA?: boolean;
  emailNotification?: boolean;
  twoFactorSecret?: string;
}

export class UserPreferences implements IUserPreferences {
  private constructor(
    public enable2FA: boolean,
    public emailNotification: boolean,
    public twoFactorSecret?: string
  ) {}

  static create(data?: Partial<IUserPreferences>): UserPreferences {
    return new UserPreferences(
      data?.enable2FA ?? false,
      data?.emailNotification ?? true,
      data?.twoFactorSecret
    );
  }
}
