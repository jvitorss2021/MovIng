"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

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
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchWorkout = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:5000/workouts/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWorkout(response.data);
        setName(response.data.name);
        setExercises(JSON.parse(response.data.exercises));
      } catch (error) {
        console.error("Failed to fetch workout", error);
      }
    };

    fetchWorkout();
  }, [id]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/workouts/${id}`,
        { name, exercises: JSON.stringify(exercises) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save workout", error);
    }
  };

  const handleAddExercise = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:5000/workouts/${id}/exercises`,
        { exercise: newExercise },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExercises(JSON.parse(response.data.exercises));
      setNewExercise("");
    } catch (error) {
      console.error("Failed to add exercise", error);
    }
  };

  if (!workout) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl mb-6 text-gray-900">Edit Workout</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-900"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Exercises</label>
          <ul>
            {exercises.map((exercise, index) => (
              <li key={index}>{exercise}</li>
            ))}
          </ul>
          <input
            type="text"
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-900 mt-2"
            placeholder="Add new exercise"
          />
          <button
            onClick={handleAddExercise}
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add Exercise
          </button>
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}
