import { UserPreferences } from './UserPreferenceEntity';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  userPreferences: UserPreferences;
  updatedAt?: Date;
  createdAt?: Date;
}

export class User implements IUser {
  private constructor(
    public id: string,
    public name: string,
    public email: string,
    public isEmailVerified: boolean,
    public userPreferences: UserPreferences,
    public createdAt: Date,
    public updatedAt: Date,
    public password: string
  ) {}

  // ✅ Factory method
  static create(data: {
    id?: string;
    name: string;
    email: string;
    password: string;
    isEmailVerified?: boolean;
    userPreferences?: UserPreferences;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    if (!data.email) throw new Error('User email is required');
    if (!data.name) throw new Error('User name is required');

    return new User(
      data.id ?? '',
      data.name,
      data.email,
      data.isEmailVerified ?? false,
      data.userPreferences ?? UserPreferences.create(),
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
      data.password
    );
  }

  // ✅ Domain behaviors
  verifyEmail(): void {
    this.isEmailVerified = true;
  }

  hasPassword(): boolean {
    return !!this.password;
  }

  enableTwoFactor(secret: string): void {
    this.userPreferences = this.userPreferences.enableTwoFactor(secret);
  }

  disableTwoFactor(): void {
    this.userPreferences = this.userPreferences.disableTwoFactor();
  }
}
