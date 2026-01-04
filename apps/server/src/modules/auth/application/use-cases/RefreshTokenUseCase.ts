import { EnvConfig } from '../../../../shared/config/EnvConfig';
import { UnauthorizedError } from '../../../../shared/error/Error';
import {
  calculateExpirationDate,
  ONE_DAY_IN_MILLISECONDS
} from '../../../../shared/utils/DateTime';
import { ISessionRepository } from '../../../session/domain/repositories/ISessionRepository';
import {
  accessTokenSignOptions,
  RefreshTokenPayload,
  refreshTokenSignOptions,
  TokenService
} from '../services/TokenService';

export class RefreshTokenUseCase {
  constructor(private sessionRepository: ISessionRepository) {}

  async execute(
    refreshToken: string
  ): Promise<{ accessToken: string; newRefreshToken: string | undefined }> {
    // Verify the provided refresh token is valid and extract its payload
    const { payload } = TokenService.verifyJwtToken<RefreshTokenPayload>(
      refreshToken,
      {
        secret: refreshTokenSignOptions.secret
      }
    );

    if (!payload) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Find the session associated with this refresh token
    const session = await this.sessionRepository.findById(
      payload.sessionId as string
    );
    const now = Date.now();

    // Validate that the session exists and hasn't expired
    if (!session || session.expiredAt.getTime() <= now) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Check if the session is close to expiring (less than one day remaining)
    const shouldRefreshSession =
      session.expiredAt.getTime() - now < ONE_DAY_IN_MILLISECONDS;

    if (shouldRefreshSession) {
      session.expiredAt = calculateExpirationDate(
        EnvConfig.JWT_REFRESH_EXPIRES_IN
      );

      await this.sessionRepository.updateExpiry(session.id, session.expiredAt);
    }

    // Generate a new refresh token only if the session was extended
    const newRefreshToken = shouldRefreshSession
      ? TokenService.signJwtToken(
          { sessionId: session.id },
          refreshTokenSignOptions
        )
      : undefined;

    // Generate a new access token with user and session information
    const accessToken = TokenService.signJwtToken(
      {
        userId: session.userId,
        sessionId: session.id
      },
      accessTokenSignOptions
    );

    // Return both tokens
    return {
      accessToken,
      newRefreshToken
    };
  }
}
