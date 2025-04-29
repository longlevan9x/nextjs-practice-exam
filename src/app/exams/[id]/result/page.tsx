'use client';
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ExamResult } from "@/types/ExamResult";
import ResultHeader from "@/components/result/ResultHeader";
import ExamResultCard from "@/components/result/ExamResultCard";
import { getExamById } from "@/services/examService";
import { Exam } from "@/types/exam";
import { getExamResultsByExamId } from "@/services/examResultService";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
export default function ResultPage() {
  const { id: examId } = useParams<{ id: string }>();
  const [resultData, setResultData] = useState<Exam | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const passPercentage = 72; // Example pass percentage
  const totalAttempts = examResults.length;

  useEffect(() => {
    if (examId) {
      const data = getExamById(parseInt(examId));
      if (data) {
        setResultData(data);
      }
    }
  }, [examId]);

  useEffect(() => {
    if (examId) {
      const fetchResults = async () => {
        const results = await getExamResultsByExamId(examId); // Fetch all exam results
        setExamResults(results);
      };
      fetchResults();
    }
  }, [examId]);

  if (!resultData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lg:w-1/2 mx-auto">
      <div className="mb-6">
        <ResultHeader resultData={resultData} examId={examId} />
      </div>

      {examResults.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <div className="text-center text-gray-500">
            <p>Không có kết quả thi</p>
          </div>
          <div className="mt-4">
            <Link href={`/exams/${examId}`} className=" px-4 py-2 rounded-xs bg-blue-500 text-white flex items-center justify-center gap-2">
              <ArrowLeftIcon className="w-4 h-4" />
              <span>
                Trở lại trang thi
              </span>
            </Link>
          </div>
        </div>
      )}

      {examResults.length > 0 && (
        <div className="space-y-6">
          {examResults.map((result, index) => (
            <ExamResultCard
              key={index}
              result={result}
              attemptNumber={totalAttempts - index}
              passPercentage={passPercentage}
              isExpanded={index !== 0}
              domains={resultData.domains || []}
            />
          ))}
        </div>
      )}
    </div>
  );
}