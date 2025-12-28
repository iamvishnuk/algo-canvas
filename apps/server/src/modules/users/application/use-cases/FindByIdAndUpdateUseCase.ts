import { NotFoundError } from '../../../../shared/error/Error';
import { User } from '../../domain/entities/UserEntity';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class FindByIdAndUpdateUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await this.userRepository.findByIdAndUpdaate(
      userId,
      data
    );

    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    return updatedUser;
  }
}
