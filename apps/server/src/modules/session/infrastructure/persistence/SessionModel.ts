import mongoose, { Types, Document, Schema } from 'mongoose';
import { thirtyDaysFromNow } from '../../../../shared/utils/DateTime';
import { IUserDocument } from '../../../users/infrastructure/persistence/UserModel';

export interface ISessionDocument extends Document {
  userId: Types.ObjectId | IUserDocument;
  userAgent: string;
  createdAt: Date;
  expiredAt: Date;
}

const SessionSchema = new Schema<ISessionDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userAgent: { type: String, required: false },
  createdAt: { type: Date, default: Date.now() },
  expiredAt: { type: Date, required: true, default: thirtyDaysFromNow() }
});

export const SessionModel = mongoose.model<ISessionDocument>(
  'Session',
  SessionSchema
);
