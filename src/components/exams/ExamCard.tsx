import React from "react";
import Link from "next/link";
import { ExamCardProps } from "@/types/examCard"; // Import the interface
import Image from "next/image";

const ExamCard: React.FC<ExamCardProps> = ({ id, logo, title, description, incomplete, examType }) => {
  return (
    <Link href={incomplete ? `/exams/${id}/${examType}` : `/exams/${id}`}>
      <div className="flex items-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer relative">
        {/* Status Badge */}
        {incomplete && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
            In Progress
          </div>
        )}
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            width={96}
            height={96} 
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