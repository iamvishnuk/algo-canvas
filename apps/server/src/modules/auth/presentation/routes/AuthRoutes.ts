import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateRequest } from '../../../../shared/middleware/RequestValidators';
import { registerUserSchema } from '../validators/RegisterUserValidator';
import { emailVerificationCodeSchema } from '../validators/EmailVerificationCodeValidator';
import { loginUserSchema } from '../validators/LoginUserValidator';
import { authenticateJWT } from '../../../../shared/middleware/PassportMiddleware';
import { verifyMfaSetupSchema } from '../validators/VerifyMfaSetupValidator';
import { mfaLoginSchema } from '../validators/MfaLoginValidator';

const authRoutes: Router = Router();
const authController = new AuthController();

authRoutes.post(
  '/register',
  validateRequest(registerUserSchema),
  authController.registerUser
);
authRoutes.post(
  '/verify/email',
  validateRequest(emailVerificationCodeSchema),
  authController.verifyEmail
);
authRoutes.post(
  '/login',
  validateRequest(loginUserSchema),
  authController.loginUser
);
authRoutes.get('/refresh', authController.refreshToken);

authRoutes.get('/mfa/setup', authenticateJWT, authController.setupMfa);
authRoutes.post(
  '/mfa/verify',
  authenticateJWT,
  validateRequest(verifyMfaSetupSchema),
  authController.verifyMfaSetup
);
authRoutes.put('/mfa/revoke', authenticateJWT, authController.revokeMfa);
authRoutes.post(
  '/mfa/verify-login',
  validateRequest(mfaLoginSchema),
  authController.mfaLogin
);

export default authRoutes;
