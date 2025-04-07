import React from "react";
import DonutChart from "./DonutChart";
import HorizontalLegend from "./HorizontalLegend";

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
      <HorizontalLegend data={data.map(({ name, color }) => ({ name, color }))} />
    </div>
  );
};

export default DonutChartWithLegend;