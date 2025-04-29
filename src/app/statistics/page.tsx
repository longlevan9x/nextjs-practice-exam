'use client';

import React, { Suspense, useEffect, useState } from 'react';
import StatisticsOverview from '@/components/statistics/StatisticsOverview';
import DomainAnalysis from '@/components/statistics/DomainAnalysis';
import StatisticsSection from '@/components/statistics/StatisticsSection';
import { ExamResult } from '@/types/ExamResult';
import { Exam } from '@/types/exam';
import { getExamResults } from '@/services/examResultService';
import { getAllExams } from '@/services/examService';
import { getCourses } from '@/services/course';
import { Course } from '@/types/course';
import LoadingIcon from '@/components/common/LoadingIcon';
import { useSearchParams } from 'next/navigation';
// Define statistics sections
const statisticsSections = [
  {
    title: 'Tổng quan',
    description: 'Thống kê tổng quan về kết quả học tập',
    component: StatisticsOverview
  },
  {
    title: 'Phân tích theo lĩnh vực',
    description: 'Phân tích chi tiết theo từng lĩnh vực kiến thức',
    component: DomainAnalysis
  }
];

const StatisticsPageComponent: React.FC = () => {
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(0);
  const [selectedExamId, setSelectedExamId] = useState<number>(0);
  // get courseId from query string
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  useEffect(() => {
    if (courseId) {
      setSelectedCourseId(parseInt(courseId));
    }
  }, [courseId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [results, examData, coursesData] = await Promise.all([
          getExamResults(),
          getAllExams(),
          getCourses()
        ]);
        setExamResults(results);
        setExams(examData);
        setCourses(coursesData);
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function selectedCourse(courseId: string) {
    setSelectedCourseId(parseInt(courseId));
    setSelectedExamId(0);
  }

  function selectedExam(examId: string) {
    setSelectedExamId(parseInt(examId));
  }

  // Filter exams based on selected course
  const filteredExams = selectedCourseId
    ? exams.filter(exam => exam.courseId === selectedCourseId)
    : exams;

  // Filter exam results based on selected course and exam
  const filteredResults = examResults.filter(result => {
    const exam = exams.find(e => e.id === result.examId);
    if (selectedCourseId && exam?.courseId !== selectedCourseId) return false;
    if (selectedExamId && result.examId !== selectedExamId) return false;
    return true;
  });

  // Get exams based on selected exam
  const displayExams = selectedExamId
    ? filteredExams.filter(exam => exam.id === selectedExamId)
    : filteredExams;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIcon />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Thống kê học tập</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn khóa học
            </label>
            <select
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedCourseId}
              onChange={(e) => {
                selectedCourse(e.target.value);
              }}
            >
              <option value="0">Tất cả khóa học</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn đề thi
            </label>
            <select
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedExamId}
              onChange={(e) => selectedExam(e.target.value)}
            >
              <option value="0">Tất cả đề thi</option>
              {filteredExams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Sections */}
      <div className="space-y-4">
        {statisticsSections.map((section, index) => (
          <StatisticsSection
            key={index}
            title={section.title}
            description={section.description}
            examResults={filteredResults}
            exams={displayExams}
          >
            <section.component
              examResults={filteredResults}
              exams={displayExams}
            />
          </StatisticsSection>
        ))}
      </div>
    </div>
  );
}

const StatisticsPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingIcon />}>
      <StatisticsPageComponent />
    </Suspense>
  );
};

export default StatisticsPage; 