import { User } from '../../domain/entities/UserEntity';
import { UserPreferences } from '../../domain/entities/UserPreferenceEntity';
import { IUserDocument } from '../persistence/UserModel';

export class UserMapper {
  static toDomain(userDoc: IUserDocument): User {
    return User.create({
      id: userDoc._id.toString(),
      email: userDoc.email,
      name: userDoc.name,
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
      password: user.password,
      isEmailVerified: user.isEmailVerified
    };
  }
}
