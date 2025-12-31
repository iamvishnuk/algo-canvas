import { VerificationCode } from '../../domain/entities/VerificationCodeEntity';
import { IVerificaionCodeRepository } from '../../domain/repositories/IVerificationCodeRepository';
import { VerificationCodeMapper } from '../mappers/VerificationCodeMapper';
import { VerificationCodeModel } from './VerificationCodeModel';

export class VerificationCodeRepository implements IVerificaionCodeRepository {
  async create(
    data: Pick<VerificationCode, 'userId' | 'expiresAt' | 'type' | 'code'>
  ): Promise<VerificationCode> {
    const verificationCode = await VerificationCodeModel.create(
      VerificationCodeMapper.toPersistence(data)
    );

    return VerificationCodeMapper.toDomin(verificationCode);
  }

  async delete(code: string): Promise<VerificationCode | null> {
    const verificationCode = await VerificationCodeModel.findOneAndDelete({
      code
    });

    return verificationCode
      ? VerificationCodeMapper.toDomin(verificationCode)
      : null;
  }

  async findVerificationCode(code: string): Promise<VerificationCode | null> {
    const verificationCode = await VerificationCodeModel.findOne({ code });

    return verificationCode
      ? VerificationCodeMapper.toDomin(verificationCode)
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
      ? VerificationCodeMapper.toDomin(verificationCode)
      : null;
  }
}
