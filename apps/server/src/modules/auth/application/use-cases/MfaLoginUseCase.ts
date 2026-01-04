import speakeasy from 'speakeasy';
import { BadRequestError } from '../../../../shared/error/Error';
import { ISessionRepository } from '../../../session/domain/repositories/ISessionRepository';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';
import {
  refreshTokenSignOptions,
  TokenService
} from '../services/TokenService';
import { User } from '../../../users/domain/entities/UserEntity';

export class MfaLoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private sessionRepository: ISessionRepository
  ) {}

  async execute(
    email: string,
    code: string,
    userAgent: string
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User Not found');
    }

    // Verify that 2FA is enabled for this user
    if (
      !user.userPreferences.enable2FA &&
      !user.userPreferences.twoFactorSecret
    ) {
      throw new BadRequestError('2FA is not enabled for this user');
    }

    // Verify the provided TOTP code against the user's secret
    const isValid = speakeasy.totp.verify({
      secret: user.userPreferences.twoFactorSecret!,
      encoding: 'base32',
      token: code
    });

    // If code is invalid, throw an error
    if (!isValid) {
      throw new BadRequestError('Invalid MFA code, please try again');
    }

    const session = await this.sessionRepository.create({
      userId: user.id,
      userAgent
    });

    // generate accesstoken
    const accessToken = TokenService.signJwtToken({
      userId: user.id,
      sessionId: session.id
    });

    // generate refreshtoken
    const refreshToken = TokenService.signJwtToken(
      {
        sessionId: session.id
      },
      refreshTokenSignOptions
    );

    return {
      user,
      accessToken,
      refreshToken
    };
  }
}
