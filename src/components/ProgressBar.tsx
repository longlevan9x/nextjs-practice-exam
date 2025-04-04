import React from "react";

interface ProgressBarProps {
  current: number; // Number of answered questions
  total: number; // Total number of questions
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="flex items-center space-x-2">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-sm font-medium text-gray-700">
        {current}/{total} questions answered
      </span>
    </div>
  );
};

export default ProgressBar;