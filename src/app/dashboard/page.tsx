// filepath: /home/joaovitor/projetos/treino-app/frontend/src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Workout = {
  id: number;
  name: string;
  exercises: string;
  userId: number;
  createdAt: string;
};

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5000/workouts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data); // Adicione este console log
        setWorkouts(response.data);
      } catch (error) {
        console.error("Failed to fetch workouts", error);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl mb-6 text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {workouts.map((workout) => (
          <div key={workout.id} className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold">{workout.name}</h2>
            <p>{workout.exercises}</p>
            <p className="text-gray-500 text-sm">
              Created at: {new Date(workout.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
