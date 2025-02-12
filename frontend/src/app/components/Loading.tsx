import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="text-center">
        <video src="/video.webm" width={300} height={300} autoPlay loop muted />
      </div>
    </div>
  );
};

export default Loading;
