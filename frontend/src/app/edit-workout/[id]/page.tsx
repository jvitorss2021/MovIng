"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/axios";
import { useRouter, useParams } from "next/navigation";
import Loading from "../../components/Loading";

type Exercise = {
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

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
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState("");
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
        const parsedExercises = JSON.parse(response.data.exercises);
        setExercises(parsedExercises.map((name: string) => ({
          name,
          sets: 3,
          reps: 12,
          weight: 0
        })));
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
        { 
          name, 
          exercises: JSON.stringify(exercises)
        },
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
    setExercises([...exercises, {
      name: newExercise,
      sets: 3,
      reps: 12,
      weight: 0
    }]);
    setNewExercise("");
    setError(null);
  };

  const handleDeleteExercise = (index: number) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
  };

  const handleEditExercise = (exercise: Exercise, index: number) => {
    setEditingExerciseIndex(index);
    setEditingExercise({ ...exercise });
    setShowModal(true);
  };

  const handleSaveExerciseDetails = () => {
    if (editingExerciseIndex !== null && editingExercise) {
      const updatedExercises = exercises.map((exercise, index) =>
        index === editingExerciseIndex ? editingExercise : exercise
      );
      setExercises(updatedExercises);
      setShowModal(false);
      setEditingExerciseIndex(null);
      setEditingExercise(null);
    }
  };

  const handleEditName = (exercise: Exercise, index: number) => {
    setEditingExerciseIndex(index);
    setEditingName(exercise.name);
    setShowNameModal(true);
  };

  const handleSaveExerciseName = () => {
    if (editingExerciseIndex !== null && editingName.trim()) {
      const updatedExercises = exercises.map((exercise, index) =>
        index === editingExerciseIndex 
          ? { ...exercise, name: editingName.trim() }
          : exercise
      );
      setExercises(updatedExercises);
      setShowNameModal(false);
      setEditingExerciseIndex(null);
      setEditingName("");
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
          <label className="block text-primary text-sm mb-2">Exercícios</label>
          <div className="space-y-2 mb-4">
            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="bg-base-100 rounded-lg shadow-sm hover:bg-base-200 transition-colors"
              >
                <div className="p-3">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{exercise.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditName(exercise, index);
                          }}
                          className="btn btn-ghost btn-xs"
                        >
                          ✎
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteExercise(index);
                        }}
                        className="btn btn-ghost btn-sm text-error"
                      >
                        ×
                      </button>
                    </div>
                    <div 
                      className="text-sm text-base-content/70 cursor-pointer"
                      onClick={() => handleEditExercise(exercise, index)}
                    >
                      {exercise.sets} séries × {exercise.reps} reps • {exercise.weight}kg
                    </div>
                  </div>
                </div>
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

      {/* Exercise Name Edit Modal */}
      {showNameModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowNameModal(false);
            }
          }}
        >
          <div className="bg-base-100 rounded-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Editar Nome do Exercício</h3>
              <button 
                onClick={() => setShowNameModal(false)}
                className="btn btn-ghost btn-sm"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nome</label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Nome do exercício"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowNameModal(false)}
                className="btn btn-outline flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveExerciseName}
                className="btn btn-primary flex-1"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Details Modal */}
      {showModal && editingExercise && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="bg-base-100 rounded-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{editingExercise.name}</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="btn btn-ghost btn-sm"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Séries</label>
                <input
                  type="number"
                  value={editingExercise.sets}
                  onChange={(e) => setEditingExercise({
                    ...editingExercise,
                    sets: parseInt(e.target.value) || 0
                  })}
                  className="input input-bordered w-full"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Repetições</label>
                <input
                  type="number"
                  value={editingExercise.reps}
                  onChange={(e) => setEditingExercise({
                    ...editingExercise,
                    reps: parseInt(e.target.value) || 0
                  })}
                  className="input input-bordered w-full"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Carga (kg)</label>
                <input
                  type="number"
                  value={editingExercise.weight}
                  onChange={(e) => setEditingExercise({
                    ...editingExercise,
                    weight: parseFloat(e.target.value) || 0
                  })}
                  className="input input-bordered w-full"
                  min="0"
                  step="0.5"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveExerciseDetails}
                className="btn btn-primary flex-1"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
