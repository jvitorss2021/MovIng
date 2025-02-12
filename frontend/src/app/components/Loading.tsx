import React from "react";
import Image from "next/image";
import gif from "../../../public/gif.webp"; // Certifique-se de ajustar o caminho conforme necessário

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="text-center">
        <Image src={gif} alt="Loading GIF" width={100} height={100} />
      </div>
    </div>
  );
};

export default Loading;
