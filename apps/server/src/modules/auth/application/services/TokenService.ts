import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { EnvConfig } from '../../../../shared/config/EnvConfig';

export type AccessTokenPayload = {
  userId: string;
  sessionId: string;
};

export type RefreshTokenPayload = {
  sessionId: string;
};

type SignOptsAndSecret = SignOptions & { secret: string };

export const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: EnvConfig.JWT_EXPIRES_IN as any,
  secret: EnvConfig.JWT_SECRET
};

export const refreshTokenSignOptions: SignOptsAndSecret = {
  expiresIn: EnvConfig.JWT_REFRESH_EXPIRES_IN as any,
  secret: EnvConfig.JWT_REFRESH_SECRET
};

export class TokenService {
  static signJwtToken(
    payload: AccessTokenPayload | RefreshTokenPayload,
    option?: SignOptsAndSecret
  ) {
    const { secret, ...options } = option ?? accessTokenSignOptions;

    return jwt.sign(payload, secret, {
      audience: ['user'],
      ...options
    });
  }

  static verifyJwtToken<TPayload extends object = AccessTokenPayload>(
    token: string,
    options?: VerifyOptions & { secret?: string }
  ) {
    try {
      const { secret = EnvConfig.JWT_SECRET, ...opts } = options ?? {};

      const payload = jwt.verify(token, secret, {
        audience: ['user'],
        ...opts
      }) as TPayload;

      return { payload };
    } catch (err: any) {
      return { error: err.message };
    }
  }
}
