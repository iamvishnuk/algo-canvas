import { Session } from '../entities/SessionEntity';

export interface ISessionRepository {
  create(data: Pick<Session, 'userId' | 'userAgent'>): Promise<Session>;
}
