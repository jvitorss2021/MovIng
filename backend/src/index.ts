import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import workoutRoutes from "./routes/workoutRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "https://mov-ing-3s8b.vercel.app",
  "https://moving-e3yk.onrender.com"
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/workouts', workoutRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
