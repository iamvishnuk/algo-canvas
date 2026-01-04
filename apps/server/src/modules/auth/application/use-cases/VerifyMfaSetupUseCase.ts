import speakeasy from 'speakeasy';
import { BadRequestError, NotFoundError } from '../../../../shared/error/Error';
import { User } from '../../../users/domain/entities/UserEntity';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';

export class VerifyMfaSetupUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    userId: string,
    code: string,
    secretKey: string
  ): Promise<{ message: string; userPreferences: { enable2FA: boolean } }> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // check if MFA is already enabled for the user
    if (user.userPreferences.enable2FA) {
      return {
        message: '2FA is already enabled',
        userPreferences: {
          enable2FA: user.userPreferences.enable2FA
        }
      };
    }

    // Verify the provided TOTP code against the secret key
    const isValid = speakeasy.totp.verify({
      secret: secretKey,
      encoding: 'base32',
      token: code
    });

    // If the code is invalid, throw an error
    if (!isValid) {
      throw new BadRequestError('Invalid MFA code, please try again');
    }

    await this.userRepository.findByIdAndUpdaate(user.id, {
      userPreferences: { ...user.userPreferences, enable2FA: true }
    });

    return {
      message: '2FA setup successful',
      userPreferences: {
        enable2FA: user.userPreferences.enable2FA
      }
    };
  }
}
