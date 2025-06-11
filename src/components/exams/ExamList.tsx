'use client';
import React, { useEffect, useState } from "react";
import ExamCard from "@/components/exams/ExamCard";
import ExamFilter from "@/components/exams/ExamFilter";
import { Exam } from "@/types/exam";
import { Course } from "@/types/course";
import { getIncompleteExamResults } from "@/services/examResultService";
import { getCourses } from "@/services/course";
import { getExams } from "@/services/examService";
import Link from "next/link";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import { useSearchParams } from "next/navigation";
import { ExamResult } from "@/types/ExamResult";

export default function ExamList() {
  const searchParams = useSearchParams();
  const courseId: string | null = searchParams.get('courseId');
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(0);

  useEffect(() => {
    const _getIncompleteExamResults = async (): Promise<ExamResult[]> => {
      try {
        return await getIncompleteExamResults();
      } catch (error) {
        console.log("_getIncompleteExamResults", error);
        return [];
      }
    }

    const fetchData = async () => {
      try {
        const [incompleteExamResults, coursesData] = await Promise.all([
          _getIncompleteExamResults(),
          getCourses()
        ]);

        let _exams = getExams();

        _exams = _exams.map(exam => {
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

  useEffect(() => {
    if (courseId) {
      setSelectedCourseId(parseInt(courseId));
    }
  }, [courseId]);

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
        <p className="text-red-500 dark:text-red-400 text-lg">Failed to load exams. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Available Exam Sets
        </h2>

        <div className="flex flex-row items-center gap-3">
          <ExamFilter
            courses={courses}
            selectedCourseId={selectedCourseId}
            onCourseChange={handleCourseChange}
          />

          <Link
            href={`/statistics?courseId=${selectedCourseId}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-sm flex items-center justify-center gap-1 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300"
          >
            <span className="text-sm md:text-base whitespace-nowrap">Xem thống kê</span>
            <ChartBarIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <p className="text-blue-600 dark:text-blue-400 text-lg">Loading exams...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
            />
          ))}
        </div>
      )}
    </>
  );
}