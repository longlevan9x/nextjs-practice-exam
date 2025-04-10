import React from "react";
import DonutChart from "@/components/charts/DonutChart";

interface CollapsedContentProps {
  chartData: { name: string; value: number; color: string }[];
  isPassed: boolean;
  correctPercentage: number;
  totalTime: number | undefined;
  startTime: Date | undefined;
}

const CollapsedContent: React.FC<CollapsedContentProps> = ({
  chartData,
  isPassed,
  correctPercentage,
  totalTime,
  startTime,
}) => {
  return (
    <div className="flex items-center justify-between space-x-4 pr-6">
      {/* Small Donut Chart */}
      <div className="w-24 h-24">
        <DonutChart data={chartData} />
      </div>

      {/* Status */}
      <div className="flex flex-col items-start">
        <p
          className={`text-base font-semibold ${isPassed ? "text-green-600" : "text-red-600"
            }`}
        >
          {isPassed ? "Thành công" : "Không thành công"}
        </p>
      </div>

      <div className="flex flex-col items-start">
        <p className="text-base font-bold">Đúng {correctPercentage}%</p>
      </div>

      {/* Time and Date */}
      <div className="flex flex-col items-end text-base text-gray-700">
        <p>
          {totalTime ? `${Math.floor(totalTime / 60)} giờ ${totalTime % 60} phút` : '0 giờ 0 phút'}
        </p>
      </div>

      {/* Time and Date */}
      <div className="flex flex-col items-end text-base text-gray-700">

        <p>{startTime ? startTime.toLocaleDateString() : ''}</p>
      </div>
    </div>
  );
};

export default CollapsedContent;