import React from 'react';

interface StatisticsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  title,
  description,
  children
}) => {
  return (
    <div className="bg-white rounded-xs shadow-md">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default StatisticsSection; 