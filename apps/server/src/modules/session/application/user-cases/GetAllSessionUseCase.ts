import { Session } from '../../domain/entities/SessionEntity';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';

export class GetAllSessionUseCase {
  constructor(private sessionRepository: ISessionRepository) {}

  async execute(userid: string): Promise<Session[]> {
    return await this.sessionRepository.getAllSession(userid);
  }
}
