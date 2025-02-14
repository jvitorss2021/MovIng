"use client";
import "../app/globals.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      {/* Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="mb-8">
          <video
            src="/video.webm"
            width={200}
            height={200}
            autoPlay
            loop
            muted
            className="rounded-full shadow-lg mb-6"
          />
          <h1 className="text-4xl font-bold text-primary text-center">
            MovIng
          </h1>
          <p className="text-center text-base-content/70 mt-2">
            Track your workouts, achieve your goals
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-base-100 rounded-t-3xl shadow-lg">
        <div className="flex flex-col gap-3 max-w-md mx-auto">
          <button
            onClick={handleLogin}
            className="btn btn-primary btn-lg w-full"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="btn btn-outline btn-lg w-full"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
