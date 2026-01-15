import { VerificationCode } from '../entities/VerificationCodeEntity';

export interface IVerificationCodeRepository {
  create(
    data: Pick<VerificationCode, 'userId' | 'expiresAt' | 'type' | 'code'>
  ): Promise<VerificationCode>;
  findVerificationCode(code: string): Promise<VerificationCode | null>;
  delete(code: string): Promise<VerificationCode | null>;
  findUnExpiredVerificationCode(
    code: string,
    type: string
  ): Promise<VerificationCode | null>;
}
