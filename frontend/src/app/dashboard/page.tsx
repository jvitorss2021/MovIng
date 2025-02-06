"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Workout = {
  id: number;
  name: string;
  exercises: string;
  userId: number;
  createdAt: string;
};

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5000/workouts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setWorkouts(response.data);
      } catch (error) {
        console.error("Failed to fetch workouts", error);
      }
    };

    fetchWorkouts();
  }, []);

  const handleAddWorkout = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/workouts",
        {
          name: `Treino ${String.fromCharCode(65 + workouts.length)}`,
          exercises: JSON.stringify([]),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWorkouts([...workouts, response.data]);
    } catch (error) {
      console.error("Failed to add workout", error);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/edit-workout/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-gray-900">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {workouts.map((workout) => (
          <div key={workout.id} className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold">{workout.name}</h2>
            <p>{workout.exercises}</p>
            <p className="text-gray-500 text-sm">
              Created at: {new Date(workout.createdAt).toLocaleDateString()}
            </p>
            <button
              onClick={() => handleEdit(workout.id)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        ))}
        <div className="p-4 bg-white rounded shadow flex items-center justify-center">
          <button
            onClick={handleAddWorkout}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Add Workout
          </button>
        </div>
      </div>
    </div>
  );
}
