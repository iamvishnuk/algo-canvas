import { NotFoundError } from '../../../../shared/error/Error';
import { User } from '../../domain/entities/UserEntity';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User Not found');
    }

    return user;
  }
}
