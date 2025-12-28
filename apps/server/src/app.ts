import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { EnvConfig } from './shared/config/EnvConfig';
import { sanitizeRequestMiddleware } from './shared/middleware/SanitizeRequestMiddleware';
import { logger } from './shared/utils/Logger';
import { AppError } from './shared/error/AppError';
import { errorHandler } from './shared/middleware/ErrorHandler';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: EnvConfig.APP_ORIGIN,
    credentials: true
  })
);
app.use(cookieParser());
app.use(helmet());

app.use(sanitizeRequestMiddleware);

// Setup request logging
const morganFormat = EnvConfig.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.http(message.trim())
    }
  })
);

app.get('/health', (_: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: EnvConfig.NODE_ENV
  });
});

app.all('/*splat', (req, _, next) => {
  const err = new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404);
  next(err);
});

app.use(errorHandler);

export default app;
