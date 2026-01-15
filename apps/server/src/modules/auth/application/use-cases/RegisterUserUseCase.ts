import { EnvConfig } from '../../../../shared/config/EnvConfig';
import {
  ConflictError,
  InternalServerError
} from '../../../../shared/error/Error';
import { emailService } from '../../../../shared/services/EmailService';
import { hashValue } from '../../../../shared/utils/Bcrypt';
import { anHourFromNow } from '../../../../shared/utils/DateTime';
import { generateUniqueCode } from '../../../../shared/utils/uuid';
import { User } from '../../../users/domain/entities/UserEntity';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';
import { UserMapper } from '../../../users/infrastructure/mappers/UserMapper';
import { VerificationType } from '../../domain/entities/VerificationCodeEntity';
import { IVerificationCodeRepository } from '../../domain/repositories/IVerificationCodeRepository';

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private verificationCodeRepository: IVerificationCodeRepository
  ) {}

  async execute(
    userData: Pick<User, 'name' | 'email' | 'password'>
  ): Promise<Partial<User>> {
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new ConflictError('User with this email already exist');
    }

    const createUserData = {
      ...userData,
      password: await hashValue(userData.password!)
    };

    const newUser = await this.userRepository.create(createUserData);

    if (!newUser) {
      throw new InternalServerError(
        'Unable to create user at this time. Please try again later.'
      );
    }

    // Create a verification code for the email verification
    const code = await generateUniqueCode();
    const verificationCode = await this.verificationCodeRepository.create({
      userId: newUser.id,
      expiresAt: anHourFromNow(),
      type: VerificationType.EMAIL_VERIFICATION,
      code
    });

    const verificationUrl = `${EnvConfig.APP_ORIGIN}/confirm-account?code=${verificationCode.code}`;

    await emailService.sendVerifyEmail(
      userData.email,
      userData.name,
      verificationUrl
    );

    return UserMapper.toPublic(newUser);
  }
}
