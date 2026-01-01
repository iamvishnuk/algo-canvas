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
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { SessionRepository } from '../../infrastructure/persistence/SessionRepository';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';

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
}
