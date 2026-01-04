import { BadRequestError } from '../../../../shared/error/Error';
import { compareHashValue } from '../../../../shared/utils/Bcrypt';
import { ISessionRepository } from '../../../session/domain/repositories/ISessionRepository';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';
import { UserMapper } from '../../../users/infrastructure/mappers/UserMapper';
import {
  refreshTokenSignOptions,
  TokenService
} from '../services/TokenService';

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private sessionRepository: ISessionRepository
  ) {}

  async execute(email: string, password: string, userAgent: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestError('Invalid email or password');
    }

    const isPasswordMatch = await compareHashValue(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestError('Incorrect password');
    }

    if (!user.isEmailVerified) {
      throw new BadRequestError('Email is not verified');
    }

    // If user has 2FA enabled, return early without tokens
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

    // generate refreshtoken
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
