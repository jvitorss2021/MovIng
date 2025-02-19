"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { useRouter } from "next/navigation";
import Loading from "../components/Loading";
import ProtectedRoute from "../components/ProtectedRoute";

type Exercise = {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  workoutId: number;
};

type Workout = {
  id: number;
  name: string;
  exercises: Exercise[];
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
        if ((error as any)?.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [router]);

  const handleAddWorkout = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        "/workouts",
        {
          name: `Treino ${String.fromCharCode(65 + workouts.length)}`,
          exercises: []
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

  return (
    <ProtectedRoute>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col min-h-screen bg-base-200 select-none">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-base-100 shadow-md p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-primary">My Workouts</h1>
              <button 
                onClick={handleLogout} 
                className="btn btn-ghost btn-sm text-error"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Logo/Video */}
          <div className="p-4 flex justify-center">
            <div className="pointer-events-none select-none">
              <video
                src="/video.webm"
                width={150}
                height={150}
                autoPlay
                loop
                muted
                playsInline
                className="rounded-full shadow-lg w-[150px] h-[150px] md:w-[300px] md:h-[300px] object-cover"
                style={{
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              />
            </div>
          </div>

          {/* Workout List */}
          <div className="flex-1 p-4">
            <div className="space-y-3">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-base-100 rounded-lg shadow-md overflow-hidden touch-manipulation"
                >
                  <div 
                    className="p-4 cursor-pointer hover:bg-base-200 transition-colors active:bg-base-300"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit(workout.id);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-primary select-none">
                          {workout.name}
                        </h2>
                        <p className="text-sm text-base-content/70 select-none">
                          {workout.exercises.length} {workout.exercises.length === 1 ? 'exercício' : 'exercícios'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(workout.id);
                        }}
                        className="btn btn-ghost btn-sm text-error select-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Workout Button (Fixed) */}
          <div className="fixed bottom-6 right-6">
            <button
              onClick={handleAddWorkout}
              className="btn btn-primary btn-circle btn-lg shadow-lg select-none"
            >
              +
            </button>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
