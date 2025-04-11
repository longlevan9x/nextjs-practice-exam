'use client';
import React, { useEffect, useState } from "react";
import ExamCard from "@/components/exams/ExamCard";
import { Exam } from "@/types/exam";
import { getIncompleteExamResults } from "@/services/examResultService";

export default function ExamList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await import("@/data/exams.json");
        const incompleteExamResults = await getIncompleteExamResults();

        const _exams = response.default.map(exam => {
            const incompleteExam = incompleteExamResults.find(result => result.examId === exam.id);
            const examType = incompleteExam?.examType;

            return {
                ...exam,
                incomplete: incompleteExam?.isCompleted === false,
                examType
            };
        });

        setExams(_exams);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load exams:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Failed to load exams. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Available Exam Sets
      </h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <p className="text-blue-600 text-lg">Loading exams...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <ExamCard
              key={exam.id}
              id={exam.id}
              logo={exam.imageUrl}
              title={exam.name}
              description={exam.description}
              incomplete={exam.incomplete}
              examType={exam.examType}
            />
          ))}
        </div>
      )}
    </>
  );
}