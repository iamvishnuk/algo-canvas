import { Types } from 'mongoose';
import { ISessionDocument } from '../persistence/SessionModel';
import { Session } from '../../domain/entities/SessionEntity';

export class SessionMapper {
  static toDomain(sessionDoc: ISessionDocument): Session {
    return Session.create({
      id: sessionDoc._id.toString(),
      userId: sessionDoc.userId.toString(),
      userAgent: sessionDoc.userAgent,
      createdAt: sessionDoc.createdAt,
      expiredAt: sessionDoc.expiredAt
    });
  }

  static toPersistence(session: Partial<Session>): Partial<ISessionDocument> {
    return {
      userAgent: session.userAgent,
      userId: session.userId ? new Types.ObjectId(session.userId) : undefined
    };
  }
}
