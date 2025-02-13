import { Router, Request, Response, RequestHandler } from 'express';
import { WorkoutController } from '../controllers/workoutController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { AuthenticatedRequest } from '../types/express';

const router = Router();
const workoutController = new WorkoutController();

// Todas as rotas precisam de autenticação
router.use(authenticateToken);

// Rotas
const getAllWorkouts: RequestHandler = async (req, res) => {
  await workoutController.getAllWorkouts(req as AuthenticatedRequest, res);
};

const getWorkoutById: RequestHandler = async (req, res) => {
  await workoutController.getWorkoutById(req as AuthenticatedRequest, res);
};

const createWorkout: RequestHandler = async (req, res) => {
  await workoutController.createWorkout(req as AuthenticatedRequest, res);
};

const updateWorkout: RequestHandler = async (req, res) => {
  await workoutController.updateWorkout(req as AuthenticatedRequest, res);
};

const deleteWorkout: RequestHandler = async (req, res) => {
  await workoutController.deleteWorkout(req as AuthenticatedRequest, res);
};

router.get('/', getAllWorkouts);
router.get('/:id', getWorkoutById);
router.post('/', createWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

export default router; 