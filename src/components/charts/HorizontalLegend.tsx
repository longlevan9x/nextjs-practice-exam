import React from "react";

interface HorizontalLegendProps {
  data: { name: string; color: string }[]; // Data for the legend
}

const HorizontalLegend: React.FC<HorizontalLegendProps> = ({ data }) => {
  return (
    <div className="flex flex-wrap space-x-4">
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
  );
};

export default HorizontalLegend;