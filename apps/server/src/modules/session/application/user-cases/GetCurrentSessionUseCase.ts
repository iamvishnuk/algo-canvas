import {
  NotFoundError,
  UnauthorizedError
} from '../../../../shared/error/Error';
import { User } from '../../../users/domain/entities/UserEntity';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';
import { Session } from '../../domain/entities/SessionEntity';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';

export class GetCurrentSessionUseCase {
  constructor(
    private sessionRepository: ISessionRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(sessionId: string): Promise<User> {
    const session = await this.sessionRepository.findById(sessionId);

    if (!session) {
      throw new UnauthorizedError('Session not found');
    }

    const user = await this.userRepository.findById(session.userId);

    if (!user) {
      throw new NotFoundError('User not found with this session');
    }

    return user;
  }
}
