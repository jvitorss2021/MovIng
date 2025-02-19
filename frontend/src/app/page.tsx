"use client";
import "../app/globals.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      {/* Alert Icon */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowAlert(true)}
          className="btn btn-ghost btn-circle text-warning"
        >
          <FontAwesomeIcon icon={faCircleExclamation} className="text-xl" />
        </button>
      </div>

      {/* Alert Modal */}
      {showAlert && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAlert(false);
            }
          }}
        >
          <div className="bg-base-100 rounded-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-warning flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleExclamation} />
                Aviso Importante
              </h3>
              <button 
                onClick={() => setShowAlert(false)}
                className="btn btn-ghost btn-sm"
              >
                ×
              </button>
            </div>
            <p className="text-base-content/80">
              Devido ao plano gratuito do servidor, após 15 minutos de inatividade, 
              o backend entrará em modo de espera. Quando isso acontecer, a primeira 
              requisição pode levar até 1 minuto para ser processada. Após essa primeira 
              chamada, o serviço voltará a responder normalmente.
            </p>
          </div>
        </div>
      )}

      {/* Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="mb-8 pointer-events-none select-none">
            <video
              src="/video.webm"
              autoPlay
              loop
              muted
              playsInline
              className="rounded-full shadow-lg w-[200px] h-[200px] md:w-[300px] md:h-[300px] object-cover"
              style={{
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            />
          </div>
          <h1 className="text-4xl font-bold text-primary">
            MovIng
          </h1>
          <p className="text-base-content/70 mt-2">
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
