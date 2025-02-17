import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-base-200 flex items-center justify-center z-50">
      <div className="pointer-events-none select-none">
        <video
          src="/video.webm"
          width={150}
          height={150}
          autoPlay
          loop
          muted
          playsInline
          className="rounded-full shadow-lg w-[150px] h-[150px] object-cover"
          style={{
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        />
      </div>
    </div>
  );
}
