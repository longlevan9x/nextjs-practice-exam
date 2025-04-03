import React from "react";
import { ClockIcon } from "@heroicons/react/24/solid";

interface TimerProps {
  remainingTime: number;
}

const Timer: React.FC<TimerProps> = ({ remainingTime }) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex items-center text-lg font-semibold text-gray-800">
      <ClockIcon className="w-6 h-6 mr-2 text-blue-500" />
      Thời gian còn lại: {formatTime(remainingTime)}
    </div>
  );
};

export default Timer;