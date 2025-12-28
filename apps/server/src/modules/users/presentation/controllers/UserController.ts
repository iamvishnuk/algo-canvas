import { Request, Response } from 'express';
import { asyncHandler } from '../../../../shared/utils/AsyncHandler';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserRepository } from '../../infrastructure/persistence/UserRepository';
import { GetUserByIdUseCase } from '../../application/use-cases/GetUserByIdUseCase';
import { ResponseHandler } from '../../../../shared/utils/ResponseHandler';
import { HTTPSTATUS } from '../../../../shared/config/HttpConfig';

export class UserController {
  private readonly userRepository: IUserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public getUserById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const getUserByIdUseCase = new GetUserByIdUseCase(this.userRepository);

    const user = await getUserByIdUseCase.execute(id);

    ResponseHandler.success(res, user, HTTPSTATUS.OK, 'Successfully get user');
  });
}
