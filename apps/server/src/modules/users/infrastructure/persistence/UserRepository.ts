import { User } from '../../domain/entities/UserEntity';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserMapper } from '../mappers/UserMapper';
import { UserModel } from './UserModel';

export class UserRepository implements IUserRepository {
  async create(user: Partial<User>): Promise<User> {
    const userDoc = await UserModel.create(UserMapper.toPersistence(user));
    return UserMapper.toDomain(userDoc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email });
    return userDoc ? UserMapper.toDomain(userDoc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id);
    return userDoc ? UserMapper.toDomain(userDoc) : null;
  }

  async findByIdAndUpdaate(
    id: string,
    data: Partial<User>
  ): Promise<User | null> {
    const userDoc = await UserModel.findByIdAndUpdate(
      id,
      UserMapper.toPersistence(data),
      { new: true }
    );
    return userDoc ? UserMapper.toDomain(userDoc) : null;
  }
}
