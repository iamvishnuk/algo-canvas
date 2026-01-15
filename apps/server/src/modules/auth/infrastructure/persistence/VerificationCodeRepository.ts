import { VerificationCode } from '../../domain/entities/VerificationCodeEntity';
import { IVerificationCodeRepository } from '../../domain/repositories/IVerificationCodeRepository';
import { VerificationCodeMapper } from '../mappers/VerificationCodeMapper';
import { VerificationCodeModel } from './VerificationCodeModel';

export class VerificationCodeRepository implements IVerificationCodeRepository {
  async create(
    data: Pick<VerificationCode, 'userId' | 'expiresAt' | 'type' | 'code'>
  ): Promise<VerificationCode> {
    const verificationCode = await VerificationCodeModel.create(
      VerificationCodeMapper.toPersistence(data)
    );

    return VerificationCodeMapper.toDomain(verificationCode);
  }

  async delete(code: string): Promise<VerificationCode | null> {
    const verificationCode = await VerificationCodeModel.findOneAndDelete({
      code
    });

    return verificationCode
      ? VerificationCodeMapper.toDomain(verificationCode)
      : null;
  }

  async findVerificationCode(code: string): Promise<VerificationCode | null> {
    const verificationCode = await VerificationCodeModel.findOne({ code });

    return verificationCode
      ? VerificationCodeMapper.toDomain(verificationCode)
      : null;
  }

  async findUnExpiredVerificationCode(
    code: string,
    type: string
  ): Promise<VerificationCode | null> {
    const verificationCode = await VerificationCodeModel.findOne({
      code,
      type,
      expiresAt: { $gt: new Date() }
    });

    return verificationCode
      ? VerificationCodeMapper.toDomain(verificationCode)
      : null;
  }
}
