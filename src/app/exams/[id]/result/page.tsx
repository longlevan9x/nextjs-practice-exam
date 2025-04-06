'use client';
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getExamResult } from "@/services/localStorageService";
import { ExamResult } from "@/types/ExamResult";
import ResultHeader from "@/components/result/ResultHeader";
import { getAllExamResults } from "@/services/localStorageService";
import ExamResultCard from "@/components/result/ExamResultCard";

export default function ResultPage() {
  const { id: examId } = useParams<{ id: string }>();
  const [resultData, setResultData] = useState<ExamResult | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const passPercentage = 72; // Example pass percentage

  useEffect(() => {
    if (examId) {
      const data = getExamResult(examId); // Fetch data from localStorage
      setResultData(data);
    }
  }, [examId]);

  useEffect(() => {
    const results = getAllExamResults(); // Fetch all exam results
    setExamResults(results);
  }, []);

  if (!resultData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lg:w-1/2 mx-auto">
      {/* Result Header */}
      <ResultHeader resultData={resultData} examId={examId} />

      <div className="space-y-6">
        {examResults.map((result, index) => (
          <ExamResultCard
            key={result.examId}
            result={result}
            attemptNumber={index + 1}
            passPercentage={passPercentage}
          />
        ))}
      </div>
    </div>
  );
}