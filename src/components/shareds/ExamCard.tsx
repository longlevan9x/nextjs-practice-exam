import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Exam } from "@/types/exam";

interface SharedExamCardProps {
  exam: Exam;
}

const SharedExamCard: React.FC<SharedExamCardProps> = ({ exam }) => {
  return (
    <Link href={exam.incomplete ? `/exams/${exam.id}/${exam.examType}` : `/exams/${exam.id}`}>
      <div className="flex items-center bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg dark:hover:shadow-gray-800 transition-shadow duration-300 p-6 cursor-pointer relative">
        {/* Status Badge */}
        {exam.incomplete && (
          <div className="absolute top-0 right-2 bg-blue-500 dark:bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
            In Progress
          </div>
        )}
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            width={96}
            height={96} 
            src={exam.imageUrl}
            alt={`${exam.name} logo`}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="ml-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-300">{exam.name}</h3>
          <p className="text-gray-600 dark:text-gray-400">{exam.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default SharedExamCard;