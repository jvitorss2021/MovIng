// filepath: /home/joaovitor/projetos/treino-app/backend/src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

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

app.get("/workouts", async (req: Request, res: Response) => {
  const workouts = await prisma.workout.findMany();
  res.json(workouts);
});

app.post("/workouts", async (req: Request, res: Response) => {
  const { name, exercises, userId } = req.body;
  const workout = await prisma.workout.create({
    data: { name, exercises, userId },
  });
  res.json(workout);
});

app.post("/populate-workouts", async (req: Request, res: Response) => {
  const { userId } = req.body;
  const workouts = [
    {
      name: "Treino A",
      exercises: JSON.stringify(["Exercício 1", "Exercício 2"]),
      userId,
    },
    {
      name: "Treino B",
      exercises: JSON.stringify(["Exercício 3", "Exercício 4"]),
      userId,
    },
    {
      name: "Treino C",
      exercises: JSON.stringify(["Exercício 5", "Exercício 6"]),
      userId,
    },
  ];
  const createdWorkouts = await prisma.workout.createMany({
    data: workouts,
  });
  res.json(createdWorkouts);
});

app.put("/workouts/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, exercises } = req.body;
  const updatedWorkout = await prisma.workout.update({
    where: { id: Number(id) },
    data: { name, exercises },
  });
  res.json(updatedWorkout);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
