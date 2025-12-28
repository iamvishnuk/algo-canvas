import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/Logger';
import { HTTPSTATUS } from '../config/HttpConfig';
import { EnvConfig } from '../config/EnvConfig';

const sendErrorDev = (error: any, res: Response): void => {
  res.status(error.statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    status: error.status || 'error',
    error: error,
    message: error.message,
    stack: error.stack
  });
};

const sendErrorProd = (error: any, res: Response): void => {
  // Operational, trusted error: send message to client
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('ERROR 💥', error);
    res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

export const errorHandler = (
  error: any,
  _: Request,
  res: Response,
  next: NextFunction
): void => {
  const ERROR_STATUS_MAP: { [key: string]: number } = {
    NotFoundError: HTTPSTATUS.NOT_FOUND,
    BadRequestError: HTTPSTATUS.BAD_REQUEST,
    UnauthorizedError: HTTPSTATUS.UNAUTHORIZED,
    ForbiddenError: HTTPSTATUS.FORBIDDEN,
    ConflictError: HTTPSTATUS.CONFLICT,
    UnprocessableEntityError: HTTPSTATUS.UNPROCESSABLE_ENTITY,
    InternalServerError: HTTPSTATUS.INTERNAL_SERVER_ERROR,
    NotImplemented: HTTPSTATUS.NOT_IMPLEMENTED,
    BadGateway: HTTPSTATUS.BAD_GATEWAY,
    ServiceUnavailable: HTTPSTATUS.SERVICE_UNAVAILABLE,
    GatewayTimeout: HTTPSTATUS.GATEWAY_TIMEOUT,
    TooManyRequests: HTTPSTATUS.TOO_MANY_REQUESTS
  };

  if (error.name && ERROR_STATUS_MAP[error.name]) {
    error.statusCode = ERROR_STATUS_MAP[error.name];
    error.status = 'error';
  }

  // Fallback for unhandled errors
  error.statusCode = error.statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR;
  error.status = error.status || 'error';

  res.setHeader('Content-Type', 'application/json');

  if (EnvConfig.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (
    EnvConfig.NODE_ENV === 'production' ||
    EnvConfig.NODE_ENV === 'test'
  ) {
    sendErrorProd(error, res);
  }

  next();
};
