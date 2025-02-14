import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type WorkoutCreateData = {
  name: string;
  userId: number;
  exercises: {
    name: string;
    sets?: number;
    reps?: number;
    weight?: number;
  }[];
};

type WorkoutUpdateData = {
  name?: string;
  exercises?: {
    name: string;
    sets?: number;
    reps?: number;
    weight?: number;
  }[];
};

export class WorkoutService {
  async getAllWorkouts(userId: number) {
    const workouts = await prisma.workout.findMany({
      where: { userId },
      include: {
        exercises: true
      },
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
      },
      include: {
        exercises: true
      }
    });
    
    if (!workout) {
      throw new Error('Treino não encontrado');
    }
    
    return workout;
  }

  async createWorkout(data: WorkoutCreateData) {
    const workout = await prisma.workout.create({
      data: {
        name: data.name,
        userId: data.userId,
        exercises: {
          create: data.exercises.map(exercise => ({
            name: exercise.name,
            sets: exercise.sets || 3,
            reps: exercise.reps || 12,
            weight: exercise.weight || 0
          }))
        }
      },
      include: {
        exercises: true
      }
    });

    return workout;
  }

  async updateWorkout(id: number, userId: number, data: WorkoutUpdateData) {
    // Primeiro deletamos todos os exercícios existentes
    await prisma.exercise.deleteMany({
      where: {
        workoutId: id
      }
    });

    // Depois atualizamos o treino com os novos exercícios
    const workout = await prisma.workout.update({
      where: { 
        id,
        userId 
      },
      data: {
        name: data.name,
        exercises: {
          create: data.exercises?.map(exercise => ({
            name: exercise.name,
            sets: exercise.sets || 3,
            reps: exercise.reps || 12,
            weight: exercise.weight || 0
          })) || []
        }
      },
      include: {
        exercises: true
      }
    });

    return workout;
  }

  async deleteWorkout(id: number, userId: number) {
    // Os exercícios serão deletados automaticamente devido à relação no Prisma
    await prisma.workout.delete({
      where: { 
        id,
        userId 
      }
    });
  }
} 