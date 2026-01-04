import { Request, Response } from 'express';
import { HTTPSTATUS } from '../../../../shared/config/HttpConfig';
import { asyncHandler } from '../../../../shared/utils/AsyncHandler';
import { ResponseHandler } from '../../../../shared/utils/ResponseHandler';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { UserRepository } from '../../../users/infrastructure/persistence/UserRepository';
import { IVerificaionCodeRepository } from '../../domain/repositories/IVerificationCodeRepository';
import { VerificationCodeRepository } from '../../infrastructure/persistence/VerificationCodeRepository';
import { VerifyEmailUseCase } from '../../application/use-cases/VerifyEmailUseCase';
import { TEmailVerificationCodeBody } from '../validators/EmailVerificationCodeValidator';
import { TRegisterUserBody } from '../validators/RegisterUserValidator';
import { TLoginUserBody } from '../validators/LoginUserValidator';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import { UnauthorizedError } from '../../../../shared/error/Error';
import { RefreshTokenUseCase } from '../../application/use-cases/RefreshTokenUseCase';
import { SetupMfaUseCase } from '../../application/use-cases/SetupMfaUseCase';
import { ISessionRepository } from '../../../session/domain/repositories/ISessionRepository';
import { SessionRepository } from '../../../session/infrastructure/persistence/SessionRepository';
import { VerifyMfaSetupUseCase } from '../../application/use-cases/VerifyMfaSetupUseCase';
import { TVerifyMfaSetupBody } from '../validators/VerifyMfaSetupValidator';
import { RevokeMfaUseCase } from '../../application/use-cases/RevokeMfaUseCase';
import { MfaLoginUseCase } from '../../application/use-cases/MfaLoginUseCase';
import { IMfaLoginBody } from '../validators/MfaLoginValidator';

export class AuthController {
  private readonly userRepository: IUserRepository;
  private readonly verificationCodeRepository: IVerificaionCodeRepository;
  private readonly sessionRepository: ISessionRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.verificationCodeRepository = new VerificationCodeRepository();
    this.sessionRepository = new SessionRepository();
  }

  public registerUser = asyncHandler(
    async (req: Request<{}, {}, TRegisterUserBody>, res: Response) => {
      const body = req.body;

      const registerUserUseCase = new RegisterUserUseCase(
        this.userRepository,
        this.verificationCodeRepository
      );

      const user = await registerUserUseCase.execute(body);

      ResponseHandler.success(
        res,
        user,
        HTTPSTATUS.CREATED,
        'User Registered successsfully'
      );
    }
  );

  public verifyEmail = asyncHandler(
    async (req: Request<{}, {}, TEmailVerificationCodeBody>, res: Response) => {
      const code = req.body.code;

      const verifiyEmailUseCase = new VerifyEmailUseCase(
        this.userRepository,
        this.verificationCodeRepository
      );

      const user = await verifiyEmailUseCase.execute(code);

      ResponseHandler.success(
        res,
        user,
        HTTPSTATUS.OK,
        'Account verified successfully'
      );
    }
  );

  public loginUser = asyncHandler(
    async (req: Request<{}, {}, TLoginUserBody>, res: Response) => {
      const userAgent = req.headers['user-agent'] as string;
      const { email, password } = req.body;

      const loginUserUseCase = new LoginUserUseCase(
        this.userRepository,
        this.sessionRepository
      );

      const { user, mfaRequired, accessToken, refreshToken } =
        await loginUserUseCase.execute(email, password, userAgent);

      if (mfaRequired) {
        return ResponseHandler.success(
          res,
          { user, mfaRequired },
          HTTPSTATUS.OK,
          'MFA required'
        );
      }

      ResponseHandler.authSuccess(
        res,
        { user, mfaRequired },
        accessToken,
        refreshToken,
        HTTPSTATUS.OK,
        'User Logged in successfully'
      );
    }
  );

  public refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies as Record<string, string | undefined>;

    if (!refreshToken) {
      throw new UnauthorizedError('Missing refresh token');
    }

    const refreshTokenUseCase = new RefreshTokenUseCase(this.sessionRepository);
    const { accessToken, newRefreshToken } =
      await refreshTokenUseCase.execute(refreshToken);

    ResponseHandler.authSuccess(
      res,
      {},
      accessToken,
      newRefreshToken,
      HTTPSTATUS.OK,
      'Token refreshed successfully'
    );
  });

  public setupMfa = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user!;

    const setupMfaUseCase = new SetupMfaUseCase(this.userRepository);

    const { message, qrImageUrl, secret } = await setupMfaUseCase.execute(
      user.id
    );

    ResponseHandler.success(
      res,
      { secret, qrImageUrl },
      HTTPSTATUS.OK,
      message
    );
  });

  public verifyMfaSetup = asyncHandler(
    async (req: Request<{}, {}, TVerifyMfaSetupBody>, res: Response) => {
      const { code, secretKey } = req.body;
      const userId = req.user?.id!;

      const verifyMfaSetupUseCase = new VerifyMfaSetupUseCase(
        this.userRepository
      );

      const { message, userPreferences } = await verifyMfaSetupUseCase.execute(
        userId,
        code,
        secretKey
      );

      ResponseHandler.success(res, { userPreferences }, HTTPSTATUS.OK, message);
    }
  );

  public revokeMfa = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id!;

    const revokeMfaUseCase = new RevokeMfaUseCase(this.userRepository);

    const { message, userPreferences } = await revokeMfaUseCase.execute(userId);

    ResponseHandler.success(res, { userPreferences }, HTTPSTATUS.OK, message);
  });

  public mfaLogin = asyncHandler(
    async (req: Request<{}, {}, IMfaLoginBody>, res: Response) => {
      const { code, email } = req.body;
      const userAgent = req.headers['user-agent'] as string;

      const mfaLoginUseCase = new MfaLoginUseCase(
        this.userRepository,
        this.sessionRepository
      );

      const { user, accessToken, refreshToken } = await mfaLoginUseCase.execute(
        email,
        code,
        userAgent
      );

      ResponseHandler.authSuccess(
        res,
        { user },
        accessToken,
        refreshToken,
        HTTPSTATUS.OK,
        'User Logged in successfully'
      );
    }
  );
}
