'use client';
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ExamResult } from "@/types/ExamResult";
import ResultHeader from "@/components/result/ResultHeader";
import ExamResultCard from "@/components/result/ExamResultCard";
import { getExamById } from "@/services/examService";
import { Exam } from "@/types/exam";
import { getExamResultsByExamId } from "@/services/examResultService";

export default function ResultPage() {
  const { id: examId } = useParams<{ id: string }>();
  const [resultData, setResultData] = useState<Exam | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const passPercentage = 72; // Example pass percentage
  const totalAttempts = examResults.length;
  
  useEffect(() => {
    if (examId) {
      const data = getExamById(examId);
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
    </div>
  );
}