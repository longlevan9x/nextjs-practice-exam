import React, { useEffect, useState } from "react";
import { getExamById } from "@/services/examService";
import { Exam } from "@/types/exam";

interface ResultHeaderProps {
  resultData: Exam;
  examId: string; // Pass the examId to fetch the title dynamically
}

const ResultHeader: React.FC<ResultHeaderProps> = ({ examId }) => {
  const [examData, setExamData] = useState<Exam | null>(null);

  useEffect(() => {
    const exam = getExamById(parseInt(examId)); // Fetch the exam title dynamically
    if (exam) {
      setExamData(exam);
    }
  }, [examId]);

  // Convert total time (in minutes) to hours and minutes
  const hours = Math.floor((examData?.duration || 0) / 60 || 0); // Assuming duration is in minutes
  const minutes = Math.floor((examData?.duration || 0) % 60 || 0); // Remaining minutes

  return (
    <div className="space-y-4">
      {/* Exam Title */}
      <h1 className="text-2xl font-bold text-center">
        {examData ? `${examData.name} - Kết quả` : "Loading..."}
      </h1>

      {/* Information Row */}
      <div className="flex flex-wrap justify-center items-center text-gray-700 space-x-4">
        <p className="text-base">
          <span className="font-semibold">{examData?.questionCount}</span> câu hỏi
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
          <span className="font-semibold">{examData?.passScore}%</span> thì mới đạt
        </p>
      </div>

      {/* Divider */}
      <hr className="border-gray-300" />
    </div>
  );
};

export default ResultHeader;