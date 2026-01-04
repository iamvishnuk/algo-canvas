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

  async findById(id: string): Promise<Session | null> {
    const session = await SessionModel.findById(id);

    return session ? SessionMapper.toDomain(session) : null;
  }

  async updateExpiry(id: string, expiredAt: Date): Promise<Session | null> {
    const session = await SessionModel.findByIdAndUpdate(
      id,
      { expiredAt },
      { new: true }
    );

    return session ? SessionMapper.toDomain(session) : null;
  }

  async getAllSession(userId: string): Promise<Session[]> {
    const session = await SessionModel.find({ userId });
    return session.length ? session.map(SessionMapper.toDomain) : [];
  }

  async findCurrentSessionById(sessionId: string): Promise<Session | null> {
    const session = await SessionModel.findById(sessionId)
      .populate('userId')
      .select('-expiredAt');

    return session ? SessionMapper.toDomain(session) : null;
  }

  async findOneAndDelete(
    sessionid: string,
    userId: string
  ): Promise<Session | null> {
    const session = await SessionModel.findOneAndDelete({
      _id: sessionid,
      userId
    });

    return session ? SessionMapper.toDomain(session) : null;
  }
}
