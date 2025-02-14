"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/axios";
import { useRouter, useParams } from "next/navigation";
import Loading from "../../components/Loading";

type Workout = {
  id: number;
  name: string;
  exercises: string;
  userId: number;
  createdAt: string;
};

export default function EditWorkout() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<string[]>([]);
  const [newExercise, setNewExercise] = useState("");
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);
  const [editingExerciseText, setEditingExerciseText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchWorkout = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await api.get(`/workouts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkout(response.data);
        setName(response.data.name);
        setExercises(JSON.parse(response.data.exercises));
      } catch (error) {
        console.error("Failed to fetch workout", error);
        setError("Failed to fetch workout");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      await api.put(
        `/workouts/${id}`,
        { name, exercises: JSON.stringify(exercises) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save workout", error);
      setError("Failed to save workout");
    }
  };

  const handleAddExercise = () => {
    if (!newExercise.trim()) {
      setError("Exercise name cannot be empty");
      return;
    }
    setExercises([...exercises, newExercise]);
    setNewExercise("");
    setError(null);
  };

  const handleDeleteExercise = (index: number) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
  };

  const handleEditExercise = (index: number) => {
    setEditingExerciseIndex(index);
    setEditingExerciseText(exercises[index]);
  };

  const handleSaveEditedExercise = () => {
    if (editingExerciseIndex !== null) {
      if (!editingExerciseText.trim()) {
        setError("Exercise name cannot be empty");
        return;
      }
      const updatedExercises = exercises.map((exercise, index) =>
        index === editingExerciseIndex ? editingExerciseText : exercise
      );
      setExercises(updatedExercises);
      setEditingExerciseIndex(null);
      setEditingExerciseText("");
      setError(null);
    }
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  if (loading) {
    return <Loading />;
  }

  if (!workout) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-base-100 shadow-md p-4">
        <div className="flex items-center justify-between">
          <button onClick={handleBack} className="btn btn-ghost btn-sm">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-primary">Edit Workout</h1>
          <button onClick={handleSave} className="btn btn-primary btn-sm">
            Save
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {error && <div className="alert alert-error mb-4">{error}</div>}
        
        {/* Workout Name */}
        <div className="mb-6">
          <label className="block text-primary text-sm mb-2">Workout Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        {/* Exercises List */}
        <div>
          <label className="block text-primary text-sm mb-2">Exercises</label>
          <div className="space-y-2 mb-4">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="bg-base-100 rounded-lg shadow-sm"
              >
                {editingExerciseIndex === index ? (
                  <div className="p-3">
                    <input
                      type="text"
                      value={editingExerciseText}
                      onChange={(e) => setEditingExerciseText(e.target.value)}
                      onBlur={handleSaveEditedExercise}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveEditedExercise();
                        }
                      }}
                      className="input input-bordered w-full"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="p-3 flex items-center justify-between">
                    <span 
                      onClick={() => handleEditExercise(index)}
                      className="flex-1 cursor-pointer hover:text-primary"
                    >
                      {exercise}
                    </span>
                    <button
                      onClick={() => handleDeleteExercise(index)}
                      className="btn btn-ghost btn-sm text-error"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Exercise Input */}
          <div className="fixed bottom-0 left-0 right-0 bg-base-100 p-4 shadow-lg">
            <div className="flex gap-2 max-w-lg mx-auto">
              <input
                type="text"
                value={newExercise}
                onChange={(e) => setNewExercise(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddExercise();
                  }
                }}
                className="input input-bordered flex-1"
                placeholder="Add new exercise"
              />
              <button
                onClick={handleAddExercise}
                className="btn btn-primary"
              >
                Add
              </button>
            </div>
          </div>
          {/* Spacer to prevent content from being hidden behind fixed input */}
          <div className="h-20" />
        </div>
      </div>
    </div>
  );
}
