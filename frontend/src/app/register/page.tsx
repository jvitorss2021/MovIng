"use client";

import { useState } from "react";
import { api } from "../../lib/axios";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await api.post("/register", {
        username,
        name,
        password,
      });
      router.push("/login");
    } catch (err: unknown) {
      console.error("Registration failed", err);
      if (err instanceof AxiosError && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="bg-base-100 p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl text-primary mb-4 text-center">Register</h2>
        {error && <div className="alert alert-error mb-4">{error}</div>}
        <div className="mb-4">
          <label className="block text-primary">Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-primary">Name</label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-primary">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-primary">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full mb-4">
          Register
        </button>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="btn btn-secondary w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
}
