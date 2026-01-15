import { Types } from 'mongoose';
import {
  VerificationCode,
  VerificationType
} from '../../domain/entities/VerificationCodeEntity';
import { IVerificationCodeDocument } from '../persistence/VerificationCodeModel';

export class VerificationCodeMapper {
  static toDomain(
    verificationCodeDoc: IVerificationCodeDocument
  ): VerificationCode {
    return VerificationCode.create({
      id: verificationCodeDoc._id.toString(),
      code: verificationCodeDoc.code,
      type: verificationCodeDoc.type as VerificationType,
      userId: verificationCodeDoc.userId.toString(),
      createdAt: verificationCodeDoc.createdAt,
      expiresAt: verificationCodeDoc.expiresAt
    });
  }

  static toPersistence(
    verificationCode: Partial<VerificationCode>
  ): Partial<IVerificationCodeDocument> {
    return {
      code: verificationCode.code,
      type: verificationCode.type,
      userId: verificationCode.userId
        ? new Types.ObjectId(verificationCode.userId)
        : undefined,
      expiresAt: verificationCode.expiresAt
    };
  }
}
