import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/AsyncHandler';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';
import { UserRepository } from '../../../users/infrastructure/persistence/UserRepository';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { SessionRepository } from '../../infrastructure/persistence/SessionRepository';
import { GetAllSessionUseCase } from '../../application/user-cases/GetAllSessionUseCase';
import { ResponseHandler } from '../../../../shared/utils/ResponseHandler';
import { HTTPSTATUS } from '../../../../shared/config/HttpConfig';
import { GetCurrentSessionUseCase } from '../../application/user-cases/GetCurrentSessionUseCase';
import { DeleteSessionUseCase } from '../../application/user-cases/DeleteSessionUseCase';

export class SessionController {
  private sessionRepository: ISessionRepository;
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.sessionRepository = new SessionRepository();
  }

  public getAllSession = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const sessionId = req.sessionId!;

    const getAllSessionUseCase = new GetAllSessionUseCase(
      this.sessionRepository
    );
    const sessions = await getAllSessionUseCase.execute(userId);

    const modifiedSessions = sessions.map((session) => ({
      ...session,
      isCurrent: String(session.id) === sessionId
    }));

    ResponseHandler.success(
      res,
      modifiedSessions,
      HTTPSTATUS.OK,
      'All session fetched successful'
    );
  });

  public getCurrentSession = asyncHandler(
    async (req: Request, res: Response) => {
      const sessionId = req.sessionId!;

      const getCurrentSessionUseCase = new GetCurrentSessionUseCase(
        this.sessionRepository,
        this.userRepository
      );

      const user = await getCurrentSessionUseCase.execute(sessionId);

      ResponseHandler.success(
        res,
        user,
        HTTPSTATUS.OK,
        'Current session fetched successful'
      );
    }
  );

  public deleteSession = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id!;
    const sessionId = req.sessionId!;

    const deleteSessionUseCase = new DeleteSessionUseCase(
      this.sessionRepository
    );
    const session = await deleteSessionUseCase.execute(userId, sessionId);

    ResponseHandler.success(
      res,
      session,
      HTTPSTATUS.OK,
      'Session delete successfully'
    );
  });
}
