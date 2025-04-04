import React from "react";

interface ProgressBarProps {
  current: number; // Number of answered questions
  total: number; // Total number of questions
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);

  // Determine the color based on progress
  const progressColor =
    percentage >= 80
      ? "bg-green-600"
      : percentage >= 50
      ? "bg-orange-500"
      : "bg-blue-600";

  return (
    <div className="w-full flex items-center space-x-4">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${progressColor} h-2.5 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-sm font-medium text-gray-700">
        {current}/{total} ({percentage}%)
      </span>
    </div>
  );
};

export default ProgressBar;