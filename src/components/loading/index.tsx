import React, { useEffect, useState } from "react";
import { ILLogoImage } from "../../assets";

interface Props {
  setIsLoading: (value: boolean) => void;
}

const Loading: React.FC<Props> = ({ setIsLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return oldProgress + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [progress, setIsLoading]);

  return (
    <div className="flex items-center justify-center h-screen w-screen fixed bg-white z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="flex flex-col items-center z-10">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg animate-pulse"></div>
          <div className="relative bg-gray-50 backdrop-blur-sm p-6 rounded-full border border-gray-200 shadow-xl">
            <img
              src={ILLogoImage}
              className="w-16 h-16 animate-pulse"
              alt="Logo Donggala"
            />
          </div>
        </div>

        <h2 className="text-gray-800 text-xl font-semibold mb-2 animate-fadeIn">
          Memuat Aplikasi
        </h2>
        <p className="text-gray-600 text-sm mb-8 animate-fadeIn delay-300">
          Mohon tunggu sebentar...
        </p>

        <div className="w-80 mb-4">
          <div className="flex justify-between text-gray-600 text-xs mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 backdrop-blur-sm border border-gray-300">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full w-full bg-white/30 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Loading;
