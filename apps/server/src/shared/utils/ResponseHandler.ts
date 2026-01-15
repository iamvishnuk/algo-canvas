import { Response } from 'express';
import { EnvConfig } from '../config/EnvConfig';
import { HttpStatusCode } from '../config/HttpConfig';
import { calculateExpirationDate } from './DateTime';

export class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    statusCode: HttpStatusCode = 200,
    message = 'Success'
  ): Response {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data
    });
  }

  static error(
    res: Response,
    error: Error,
    statusCode: HttpStatusCode = 500
  ): Response {
    return res.status(statusCode).json({
      status: 'error',
      message: error.message,
      stack: EnvConfig.NODE_ENV === 'development' ? error.stack : undefined
    });
  }

  static authSuccess<T>(
    res: Response,
    data: T,
    accessToken: string | undefined,
    refreshToken: string | undefined,
    statusCode: HttpStatusCode = 200,
    message = 'Authentication successful'
  ): Response {
    if (accessToken) {
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: EnvConfig.NODE_ENV === 'production' ? true : false,
        sameSite: EnvConfig.NODE_ENV === 'production' ? 'strict' : 'lax',
        expires: calculateExpirationDate(EnvConfig.JWT_EXPIRES_IN)
      });
    }

    if (refreshToken) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: EnvConfig.NODE_ENV === 'production' ? true : false,
        sameSite: EnvConfig.NODE_ENV === 'production' ? 'strict' : 'lax',
        expires: calculateExpirationDate(EnvConfig.JWT_REFRESH_EXPIRES_IN),
        path: `${EnvConfig.API_PREFIX}/auth/refresh`
      });
    }

    // Return response with tokens in body
    return res.status(statusCode).json({
      status: 'success',
      message,
      data
    });
  }

  static clearCookies(
    res: Response,
    statusCode: HttpStatusCode = 200,
    message: string = 'Cookies cleared'
  ): Response {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', {
      path: `${EnvConfig.API_PREFIX}/auth/refresh`
    });
    return res.status(statusCode).json({
      status: 'success',
      message
    });
  }

  static redirect(res: Response, url: string): void {
    res.redirect(url);
  }

  static redirectWithTokens(
    res: Response,
    url: string,
    accessToken: string | undefined,
    refreshToken: string | undefined
  ): void {
    if (accessToken) {
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: EnvConfig.NODE_ENV === 'production' ? true : false,
        sameSite: EnvConfig.NODE_ENV === 'production' ? 'strict' : 'lax',
        expires: calculateExpirationDate(EnvConfig.JWT_EXPIRES_IN)
      });
    }

    if (refreshToken) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: EnvConfig.NODE_ENV === 'production' ? true : false,
        sameSite: EnvConfig.NODE_ENV === 'production' ? 'strict' : 'lax',
        expires: calculateExpirationDate(EnvConfig.JWT_REFRESH_EXPIRES_IN),
        path: `${EnvConfig.API_PREFIX}/auth/refresh`
      });
    }

    res.redirect(url);
  }
}
