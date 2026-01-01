import mongoose, { Types, Document, Schema } from 'mongoose';

export interface IVerificationCodeDocument extends Document {
  code: string;
  type: string;
  userId: Types.ObjectId;
  createdAt: Date;
  expiresAt: Date;
}

const VerificationCodeSchema = new Schema<IVerificationCodeDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: 'User'
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

export const VerificationCodeModel = mongoose.model<IVerificationCodeDocument>(
  'VerificationCode',
  VerificationCodeSchema,
  'verification_codes'
);
