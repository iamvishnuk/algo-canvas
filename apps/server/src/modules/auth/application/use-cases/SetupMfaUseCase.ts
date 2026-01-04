import qrcode from 'qrcode';
import speakeasy from 'speakeasy';
import { User } from '../../../users/domain/entities/UserEntity';
import { IUserRepository } from '../../../users/domain/repositories/IUserRepository';
import { NotFoundError } from '../../../../shared/error/Error';

export class SetupMfaUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    userId: string
  ): Promise<{ message: string; qrImageUrl: string; secret: string }> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if 2FA is already enabled for the user
    if (user.userPreferences.enable2FA) {
      return {
        message: '2FA is already enabled',
        qrImageUrl: '',
        secret: ''
      };
    }

    // Get existing secret key or generate a new one
    let secretKey = user.userPreferences.twoFactorSecret;

    if (!secretKey) {
      // Generate a new secret key
      const secret = speakeasy.generateSecret({ name: 'Algo Canvas' });
      secretKey = secret.base32;
      // Save the secret key to user preferences
      await this.userRepository.findByIdAndUpdaate(user.id, {
        userPreferences: { ...user.userPreferences, twoFactorSecret: secretKey }
      });
    }

    // Generate OTP auth URL for QR code
    const url = speakeasy.otpauthURL({
      secret: secretKey,
      label: user.name,
      issuer: 'algocanvas.com',
      encoding: 'base32'
    });

    // Generate QR code as data URL
    const qrCode = await qrcode.toDataURL(url);

    return {
      message: '2FA setup successful',
      qrImageUrl: qrCode,
      secret: secretKey
    };
  }
}
