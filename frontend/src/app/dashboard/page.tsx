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

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkouts(workouts.filter((workout) => workout.id !== id));
    } catch (error) {
      console.error("Failed to delete workout", error);
    }
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
          className="bg-slate-800 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {workouts.map((workout) => (
          <div key={workout.id} className="p-4 bg-white rounded shadow">
            <h2
              className="text-xl font-bold cursor-pointer text-blue-500 hover:underline"
              onClick={() => handleEdit(workout.id)}
            >
              {workout.name}
            </h2>
            <p>{workout.exercises}</p>
            <button
              onClick={() => handleDelete(workout.id)}
              className="mt-4 bg-slate-900 text-white py-2 px-4 rounded hover:bg-red-950"
            >
              Delete
            </button>
          </div>
        ))}
        <div className="p-4 bg-white rounded shadow flex items-center justify-center">
          <button
            onClick={handleAddWorkout}
            className="bg-green-800 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Add Workout
          </button>
        </div>
      </div>
    </div>
  );
}
