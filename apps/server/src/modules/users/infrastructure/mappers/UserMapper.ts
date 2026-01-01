import { User } from '../../domain/entities/UserEntity';
import { UserPreferences } from '../../domain/entities/UserPreferenceEntity';
import { IUserDocument } from '../persistence/UserModel';

export class UserMapper {
  static toDomain(userDoc: IUserDocument): User {
    return User.create({
      id: userDoc._id.toString(),
      email: userDoc.email,
      name: userDoc.name,
      password: userDoc.password,
      isEmailVerified: userDoc.isEmailVerified,
      userPreferences: UserPreferences.create({
        enable2FA: userDoc.userPreferences.enable2FA,
        emailNotification: userDoc.userPreferences.emailNotification,
        twoFactorSecret: userDoc.userPreferences.twoFactorSecret
      }),
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt
    });
  }

  static toPersistence(user: Partial<User>): Partial<IUserDocument> {
    return {
      name: user.name,
      email: user.email,
      password: user.password
    };
  }

  static toPublic(user: User): Partial<User> {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isEmailVerified: user.isEmailVerified,
      userPreferences: UserPreferences.create({
        enable2FA: user.userPreferences.enable2FA,
        emailNotification: user.userPreferences.emailNotification
      }),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
