import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const userRouter: Router = Router();

const userController = new UserController();

userRouter.get('/:id', userController.getUserById);

export default userRouter;
