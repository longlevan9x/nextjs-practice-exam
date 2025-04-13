'use client';
import React, { useEffect, useState } from "react";
import ExamCard from "@/components/exams/ExamCard";
import ExamFilter from "@/components/exams/ExamFilter";
import { Exam } from "@/types/exam";
import { Course } from "@/types/course";
import { getIncompleteExamResults } from "@/services/examResultService";
import { getCourses } from "@/services/course";
import Link from "next/link";
import { ChartBarIcon } from "@heroicons/react/24/solid";

export default function ExamList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response, incompleteExamResults, coursesData] = await Promise.all([
          import("@/data/exams.json"),
          getIncompleteExamResults(),
          getCourses()
        ]);

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
        setCourses(coursesData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(parseInt(courseId));
  };

  // Filter exams based on selected course
  const filteredExams = selectedCourseId
    ? exams.filter(exam => exam.courseId === selectedCourseId)
    : exams;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Failed to load exams. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Available Exam Sets
        </h2>

        <div className="flex items-center gap-4">
          <ExamFilter
            courses={courses}
            selectedCourseId={selectedCourseId}
            onCourseChange={handleCourseChange}
          />

          <Link href="/statistics" className="bg-blue-600 text-white px-4 py-2 rounded-sm flex items-center gap-1 hover:bg-blue-700 transition-all duration-300">
            Xem thống kê
            <ChartBarIcon className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <p className="text-blue-600 text-lg">Loading exams...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
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