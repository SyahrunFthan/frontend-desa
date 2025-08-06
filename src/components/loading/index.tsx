import React, { useEffect, useState } from "react";
import { Progress } from "antd";
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
        return oldProgress + 50;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setIsLoading(false);
    }
  }, [progress, setIsLoading]);

  return (
    <div className="flex items-center justify-center h-screen w-screen fixed bg-white z-50">
      <div className="flex flex-col items-center">
        <img
          src={ILLogoImage}
          className="w-24 h-24 mb-4 animate-bounce"
          alt="Logo Donggala"
        />
        <Progress percent={progress} />
      </div>
    </div>
  );
};

export default Loading;
