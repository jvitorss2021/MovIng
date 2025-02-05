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
      const response = await axios.get("http://localhost:5000/workouts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkouts(response.data);
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl mb-6">Dashboard</h1>
      <ul className="space-y-4">
        {workouts.map((workout) => (
          <li key={workout.id} className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold">{workout.name}</h2>
            <p>{workout.exercises}</p>
            <p className="text-gray-500 text-sm">
              Created at: {new Date(workout.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
