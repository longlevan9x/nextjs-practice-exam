import React, { useEffect, useState } from "react";
import { getExamById } from "@/services/examService";
import { Exam } from "@/types/exam";

interface ResultHeaderProps {
  resultData: Exam;
  examId: string; // Pass the examId to fetch the title dynamically
}

const ResultHeader: React.FC<ResultHeaderProps> = ({ resultData, examId }) => {
  const [examData, setExamData] = useState<Exam | null>(null);

  useEffect(() => {
    const exam = getExamById(examId); // Fetch the exam title dynamically
    if (exam) {
      setExamData(exam);
    }
  }, [examId]);

  // Extract the total number of questions
  const totalQuestions = 65;
  const percentageToPass = 72;
  // Convert total time (in minutes) to hours and minutes
  const hours = 2;
  const minutes = 10;

  return (
    <div className="p-6 space-y-4">
      {/* Exam Title */}
      <h1 className="text-2xl font-bold text-center">
        {examData ? `${examData.name} - Kết quả` : "Loading..."}
      </h1>

      {/* Information Row */}
      <div className="flex flex-wrap justify-center items-center text-gray-700 space-x-4">
        <p className="text-base">
          <span className="font-semibold">{totalQuestions}</span> câu hỏi
        </p>
        <span className="text-gray-400">|</span>
        <p className="text-base">
          <span className="font-semibold">
            {`${hours} giờ`} {`${minutes} phút`}
          </span>
        </p>
        <span className="text-gray-400">|</span>
        <p className="text-base">
          Bắt buộc phải đúng{" "}
          <span className="font-semibold">{percentageToPass}%</span> thì mới đạt
        </p>
      </div>

      {/* Divider */}
      <hr className="border-gray-300" />
    </div>
  );
};

export default ResultHeader;