import { Router } from 'express';
import { SessionController } from '../controllers/SessionController';
import { authenticateJWT } from '../../../../shared/middleware/PassportMiddleware';
import { validateParams } from '../../../../shared/middleware/RequestValidators';
import { IdSchema } from '../../../../shared/validator';

const sessionRoutes: Router = Router();
const sessionController = new SessionController();

sessionRoutes.get('/all', authenticateJWT, sessionController.getAllSession);
sessionRoutes.get(
  '/current',
  authenticateJWT,
  sessionController.getCurrentSession
);

sessionRoutes.delete(
  '/:id',
  authenticateJWT,
  validateParams(IdSchema),
  sessionController.deleteSession
);

export default sessionRoutes;
