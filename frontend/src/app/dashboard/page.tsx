"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { useRouter } from "next/navigation";
import Loading from "../components/Loading";

type Workout = {
  id: number;
  name: string;
  exercises: string;
  userId: number;
  createdAt: string;
};

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get("/workouts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkouts(response.data);
      } catch (error) {
        console.error("Failed to fetch workouts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const handleAddWorkout = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        "/workouts",
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
      await api.delete(`/workouts/${id}`, {
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen p-6 bg-base-200">
      <div className="flex justify-center mb-6">
        <video
          src="/video.webm"
          width={200}
          height={200}
          autoPlay
          loop
          muted
          className="ml-4"
        />
      </div>
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {workouts.map((workout) => (
          <div key={workout.id} className="card-compact bg-base-100 shadow-xl">
            <div className="card-body">
              <button
                className="card-title text-xl font-bold cursor-pointer text-primary hover:underline"
                onClick={() => handleEdit(workout.id)}
              >
                {workout.name}
              </button>
              <div className="card-actions justify-end">
                <button
                  onClick={() => handleDelete(workout.id)}
                  className="btn bg-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="card bg-base-100 shadow-xl flex items-center justify-center">
          <div className="card-body">
            <button onClick={handleAddWorkout} className="btn bg-teal-700 ">
              Add Workout
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <button onClick={handleLogout} className="btn bg-red-800">
          Logout
        </button>
      </div>
    </div>
  );
}
