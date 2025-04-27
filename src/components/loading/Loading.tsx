import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-2/3">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        
        {/* Loading text */}
        <p className="text-lg font-medium text-gray-700">Đang tải...</p>
        
        {/* Subtext */}
        <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
} 