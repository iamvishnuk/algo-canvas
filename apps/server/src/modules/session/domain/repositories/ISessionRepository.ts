import { Session } from '../entities/SessionEntity';

export interface ISessionRepository {
  create(data: Pick<Session, 'userId' | 'userAgent'>): Promise<Session>;
  findById(id: string): Promise<Session | null>;
  updateExpiry(id: string, expiredAt: Date): Promise<Session | null>;
  getAllSession(userId: string): Promise<Session[]>;
  findCurrentSessionById(sessionId: string): Promise<Session | null>;
  findOneAndDelete(sessionid: string, userId: string): Promise<Session | null>;
}
