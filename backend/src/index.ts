import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

declare module "express" {
  export interface Request {
    user?: {
      userId: number;
    };
  }
}

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    req.user = user;
    next();
  });
};

app.post("/register", async (req: Request, res: Response) => {
  const { username, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, name, password: hashedPassword },
  });
  res.json(user);
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.get("/workouts", authenticateToken, async (req: Request, res: Response) => {
  const workouts = await prisma.workout.findMany({
    where: { userId: req.user!.userId },
  });
  res.json(workouts);
});

app.get(
  "/workouts/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const workout = await prisma.workout.findUnique({
      where: { id: Number(id), userId: req.user!.userId },
    });
    if (!workout) {
      res.status(404).json({ error: "Workout not found" });
      return;
    }
    res.json(workout);
  }
);

app.post(
  "/workouts",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { name, exercises } = req.body;
    const workout = await prisma.workout.create({
      data: { name, exercises, userId: req.user!.userId },
    });
    res.json(workout);
  }
);

app.put(
  "/workouts/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, exercises } = req.body;
    const updatedWorkout = await prisma.workout.update({
      where: { id: Number(id), userId: req.user!.userId },
      data: { name, exercises },
    });
    res.json(updatedWorkout);
  }
);

app.delete(
  "/workouts/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.workout.delete({
      where: { id: Number(id), userId: req.user!.userId },
    });
    res.sendStatus(204);
  }
);

app.post(
  "/workouts/:id/exercises",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { exercise } = req.body;
    const workout = await prisma.workout.findUnique({
      where: { id: Number(id), userId: req.user!.userId },
    });
    if (!workout) {
      res.status(404).json({ error: "Workout not found" });
      return;
    }
    const exercises = JSON.parse(workout.exercises);
    exercises.push(exercise);
    const updatedWorkout = await prisma.workout.update({
      where: { id: Number(id) },
      data: { exercises: JSON.stringify(exercises) },
    });
    res.json(updatedWorkout);
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
