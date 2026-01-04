import { NotFoundError } from '../../../../shared/error/Error';
import { Session } from '../../domain/entities/SessionEntity';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';

export class DeleteSessionUseCase {
  constructor(private sessionRepository: ISessionRepository) {}

  async execute(userId: string, sessionId: string): Promise<Session> {
    const session = await this.sessionRepository.findOneAndDelete(
      sessionId,
      userId
    );

    if (!session) {
      throw new NotFoundError('Session not found');
    }

    return session;
  }
}
