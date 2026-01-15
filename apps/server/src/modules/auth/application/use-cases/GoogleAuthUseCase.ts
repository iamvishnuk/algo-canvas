import { BadRequestError } from '../../../../shared/error/Error';
import { ISessionRepository } from '../../../session/domain/repositories/ISessionRepository';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';
import { UserMapper } from '../../../users/infrastructure/mappers/UserMapper';
import {
  refreshTokenSignOptions,
  TokenService
} from '../services/TokenService';

export class GoogleAuthUseCase {
  constructor(
    private userRepository: IUserRepository,
    private sessionRepository: ISessionRepository
  ) {}

  async execute(userId: string, userAgent: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestError('User not found');
    }

    if (user?.userPreferences.enable2FA) {
      return {
        user: UserMapper.toPublic(user),
        mfaRequired: true,
        accessToken: '',
        refreshToken: ''
      };
    }

    // create a session
    const session = await this.sessionRepository.create({
      userId: user.id,
      userAgent
    });

    // generate accesstoken
    const accessToken = TokenService.signJwtToken({
      userId: user.id,
      sessionId: session.id
    });

    // generate refresh token
    const refreshToken = TokenService.signJwtToken(
      {
        sessionId: session.id
      },
      refreshTokenSignOptions
    );

    return {
      user: UserMapper.toPublic(user),
      mfaRequired: false,
      accessToken,
      refreshToken
    };
  }
}
