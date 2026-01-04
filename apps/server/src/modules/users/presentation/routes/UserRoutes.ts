import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const userRoutes: Router = Router();

const userController = new UserController();

userRoutes.get('/:id', userController.getUserById);

export default userRoutes;
