import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateRequest } from '../../../../shared/middleware/RequestValidators';
import { registerUserSchema } from '../validators/RegisterUserValidator';
import { emailVerificationCodeSchema } from '../validators/EmailVerificationCodeValidator';

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

export default authRouter;
