import React from "react";
import DonutChart from "./DonutChart";

interface DonutChartWithLegendProps {
  data: { name: string; value: number; color: string }[]; // Data for the chart
}

const DonutChartWithLegend: React.FC<DonutChartWithLegendProps> = ({ data }) => {
  return (
    <div className="w-full flex flex-col items-center space-y-2">
      {/* Donut Chart */}
      <div className="h-64 w-full">
      <DonutChart data={data}></DonutChart>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center space-x-4">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center space-x-2">
            <div
              className="w-3 h-3"
              style={{ backgroundColor: entry.color }}
            ></div>
            <p className="text-xs text-gray-700">{entry.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChartWithLegend;