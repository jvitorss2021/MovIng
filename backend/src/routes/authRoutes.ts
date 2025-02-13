import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

router.post('/register', async (req: Request, res: Response) => {
  await authController.register(req, res);
});

router.post('/login', async (req: Request, res: Response) => {
  await authController.login(req, res);
});

export default router; 