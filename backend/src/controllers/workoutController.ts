import { Response } from 'express';
import { WorkoutService } from '../services/workoutService';
import { AuthenticatedRequest } from '../types/express';

const workoutService = new WorkoutService();

export class WorkoutController {
  async getAllWorkouts(req: AuthenticatedRequest, res: Response) {
    try {
      const workouts = await workoutService.getAllWorkouts(req.user.userId);
      return res.json(workouts);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getWorkoutById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const workout = await workoutService.getWorkoutById(
        Number(id),
        req.user.userId
      );
      return res.json(workout);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async createWorkout(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, exercises } = req.body;
      
      if (!name || !exercises) {
        return res.status(400).json({ 
          error: 'Nome e exercícios são obrigatórios' 
        });
      }

      const workout = await workoutService.createWorkout({
        name,
        exercises,
        userId: req.user.userId
      });
      
      return res.status(201).json(workout);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateWorkout(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, exercises } = req.body;
      
      if (!name || !exercises) {
        return res.status(400).json({ 
          error: 'Nome e exercícios são obrigatórios' 
        });
      }

      const workout = await workoutService.updateWorkout(
        Number(id),
        req.user.userId,
        { name, exercises }
      );
      
      return res.json(workout);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async deleteWorkout(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      await workoutService.deleteWorkout(Number(id), req.user.userId);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 