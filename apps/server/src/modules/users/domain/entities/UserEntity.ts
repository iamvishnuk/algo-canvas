import { UserPreferences } from './UserPreferenceEntity';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  isEmailVerified: boolean;
  googleId?: string;
  provider?: 'google' | 'local';
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
    public password?: string,
    public googleId?: string,
    public provider?: 'google' | 'local'
  ) {}

  // ✅ Factory method
  static create(data: {
    id?: string;
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    provider?: 'google' | 'local';
    isEmailVerified?: boolean;
    userPreferences?: UserPreferences;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    return new User(
      data.id ?? '',
      data.name,
      data.email,
      data.isEmailVerified ?? false,
      data.userPreferences ?? UserPreferences.create(),
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
      data.password,
      data.googleId,
      data.provider
    );
  }

  hasPassword(): boolean {
    return !!this.password;
  }
}
