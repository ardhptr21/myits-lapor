import { Router } from 'express';
import { mustAuthMiddleware } from '../middlewares/auth-middleware';
import { validatorMiddleware } from '../middlewares/validator-middleware';
import { loginService, meService, registerService } from '../services/auth-service';
import { loginValidator, registerValidator } from '../validators/auth-validator';

const router: Router = Router();

router.post(
  '/register',
  validatorMiddleware({
    body: registerValidator,
  }),
  async (req, res) => {
    const response = await registerService(req.validated.body);
    return response.finalize(res);
  }
);

router.post(
  '/login',
  validatorMiddleware({
    body: loginValidator,
  }),
  async (req, res) => {
    const response = await loginService(req.validated.body);
    return response.finalize(res);
  }
);

router.get('/me', mustAuthMiddleware, async (req, res) => {
  const response = await meService(req.user.id);
  return response.finalize(res);
});

export default router;
