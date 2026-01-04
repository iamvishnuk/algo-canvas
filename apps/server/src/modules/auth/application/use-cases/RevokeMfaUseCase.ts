import {
  InternalServerError,
  NotFoundError
} from '../../../../shared/error/Error';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';

export class RevokeMfaUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    userId: string
  ): Promise<{ message: string; userPreferences: { enable2FA: boolean } }> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    //heck if 2FA is already disabled for the user
    if (!user.userPreferences.enable2FA) {
      return {
        message: 'Two-factor authentication is already disabled',
        userPreferences: {
          enable2FA: user.userPreferences.enable2FA
        }
      };
    }

    const updatedUser = await this.userRepository.findByIdAndUpdaate(user.id, {
      userPreferences: {
        ...user.userPreferences,
        twoFactorSecret: undefined,
        enable2FA: false
      }
    });

    if (!updatedUser) {
      throw new InternalServerError(
        'Failed to disable two-factor authentication'
      );
    }

    return {
      message: 'Two-factor authentication disabled successfully',
      userPreferences: {
        enable2FA: updatedUser.userPreferences.enable2FA
      }
    };
  }
}
