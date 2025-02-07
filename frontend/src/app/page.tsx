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
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-6xl font-bold text-primary mb-8 text-center">
          MovIng
        </h1>
        <div className="flex flex-col space-y-3 w-full max-w-xs">
          <button
            onClick={handleLogin}
            className="btn btn-primary w-full max-w-[200px]"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="btn btn-secondary w-full max-w-[200px]"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
