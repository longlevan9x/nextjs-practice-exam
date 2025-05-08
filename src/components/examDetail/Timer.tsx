"use client";

import React, { useEffect, useState } from "react";
import { ClockIcon } from "@heroicons/react/24/solid";

interface TimerProps {
  startTime: string; // ISO date string
  duration: number; // in minutes
}

const Timer: React.FC<TimerProps> = ({ startTime, duration }) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const startTimeInSeconds = new Date(startTime).getTime() / 1000; // Convert to seconds
    const endTimeInSeconds = startTimeInSeconds + (duration * 60); // Calculate end time in seconds
    const currentTimeInSeconds = Math.floor(Date.now() / 1000); // Current time in seconds
    const timeElapsed = endTimeInSeconds - currentTimeInSeconds;

    setRemainingTime(timeElapsed > 0 ? timeElapsed : 0);
  }, [startTime, duration]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex items-center text-lg font-semibold text-gray-800">
      <ClockIcon className="w-6 h-6 mr-2 text-blue-500" />
      {formatTime(remainingTime)}
    </div>
  );
};

export default Timer;