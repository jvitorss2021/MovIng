import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WorkoutService {
  async getAllWorkouts(userId: number) {
    const workouts = await prisma.workout.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return workouts;
  }

  async getWorkoutById(id: number, userId: number) {
    const workout = await prisma.workout.findUnique({
      where: { 
        id,
        userId 
      }
    });
    
    if (!workout) {
      throw new Error('Treino não encontrado');
    }
    
    return workout;
  }

  async createWorkout(data: { name: string, exercises: string, userId: number }) {
    const workout = await prisma.workout.create({
      data
    });
    return workout;
  }

  async updateWorkout(id: number, userId: number, data: { name: string, exercises: string }) {
    const workout = await prisma.workout.update({
      where: { 
        id,
        userId 
      },
      data
    });
    return workout;
  }

  async deleteWorkout(id: number, userId: number) {
    await prisma.workout.delete({
      where: { 
        id,
        userId 
      }
    });
  }
} 