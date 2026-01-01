import { Session } from '../../domain/entities/SessionEntity';
import { ISessionRepository } from '../../domain/repositories/ISessionRepository';
import { SessionMapper } from '../mappers/SessionMapper';
import { SessionModel } from './SessionModel';

export class SessionRepository implements ISessionRepository {
  async create(data: Pick<Session, 'userId' | 'userAgent'>): Promise<Session> {
    const session = await SessionModel.create(
      SessionMapper.toPersistence(data)
    );

    return SessionMapper.toDomain(session);
  }
}
