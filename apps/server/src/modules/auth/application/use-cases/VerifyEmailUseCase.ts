import { BadRequestError } from '../../../../shared/error/Error';
import { User } from '../../../users/domain/entities/UserEntity';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';
import { VerificationType } from '../../domain/entities/VerificationCodeEntity';
import { IVerificaionCodeRepository } from '../../domain/repositories/IVerificationCodeRepository';

export class VerifyEmailUseCase {
  constructor(
    private userRepository: IUserRepository,
    private verificationCodeRepository: IVerificaionCodeRepository
  ) {}

  async execute(code: string): Promise<User> {
    const validCode =
      await this.verificationCodeRepository.findUnExpiredVerificationCode(
        code,
        VerificationType.EMAIL_VERIFICATION
      );

    if (!validCode) {
      throw new BadRequestError('Invalid or expired verification code');
    }

    const updatedUser = await this.userRepository.findByIdAndUpdaate(
      validCode.userId,
      { isEmailVerified: true }
    );

    if (!updatedUser) {
      throw new BadRequestError('Unable to verify email address');
    }

    await this.verificationCodeRepository.delete(code);

    return updatedUser;
  }
}
