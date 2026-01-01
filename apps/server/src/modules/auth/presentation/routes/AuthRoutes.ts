import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateRequest } from '../../../../shared/middleware/RequestValidators';
import { registerUserSchema } from '../validators/RegisterUserValidator';
import { emailVerificationCodeSchema } from '../validators/EmailVerificationCodeValidator';
import { loginUserSchema } from '../validators/LoginUserValidator';

const authRouter: Router = Router();
const authController = new AuthController();

authRouter.post(
  '/register',
  validateRequest(registerUserSchema),
  authController.registerUser
);

authRouter.post(
  '/verify/email',
  validateRequest(emailVerificationCodeSchema),
  authController.verifyEmail
);

authRouter.post(
  '/login',
  validateRequest(loginUserSchema),
  authController.loginUser
);

export default authRouter;
