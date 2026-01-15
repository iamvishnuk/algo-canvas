import { User } from '../entities/UserEntity';

export interface IUserRepository {
  create(user: Partial<User>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByIdAndUpdate(id: string, data: Partial<User>): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
}
