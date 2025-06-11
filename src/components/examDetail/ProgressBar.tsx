import React from "react";

interface ProgressBarProps {
  current: number; // Number of answered questions
  total: number; // Total number of questions
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  
  let percentage = 0;
  
  if (total > 0) {
    percentage = Math.round((current / total) * 100);
  }
  
  // Determine the color based on progress
  const progressColor =
    percentage >= 80
      ? "bg-green-600"
      : percentage >= 50
      ? "bg-orange-500"
      : "bg-blue-600";

  return (
    <div className="w-full flex items-center">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 mr-4">
        <div
          className={`${progressColor} h-2.5`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Progress Text */}
      <div className="text-sm font-medium text-gray-700 text-center whitespace-nowrap dark:text-gray-400">
        {current} / {total}
      </div>
    </div>
  );
};

export default ProgressBar;