import React from "react";
import Link from "next/link";
import { ExamCardProps } from "@/types/examCard"; // Import the interface

const ExamCard: React.FC<ExamCardProps> = ({ id, logo, title, description }) => {
  return (
    <Link href={`/exams/${id}`}>
      <div className="flex items-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src={logo}
            alt={`${title} logo`}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="ml-6">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ExamCard;