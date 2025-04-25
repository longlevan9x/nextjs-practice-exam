'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Exam } from "@/types/exam";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ClipboardDocumentIcon, ClockIcon, CheckCircleIcon, ClockIcon as UpdateIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import LoadingIcon from "@/components/common/LoadingIcon";
import { fetchQuestionsByExamId } from "@/services/questionService";
import { ExamResult, ExamResultQuestion, ExamResultQuestionAnswer } from "@/types/ExamResult";
import { ExamType } from "@/constants/exam";
import { initializeExamResult } from "@/services/examResultService";
import { shuffleArray } from "@/services/utilService";
import { getExamById } from "@/services/examService";

export default function ExamDetailPage() {
  const { id } = useParams<{ id: string }>(); // Get the "id" parameter from the URL
  const router = useRouter(); // For navigation
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const handleStartExam = async (mode: string) => {
    setIsStarting(true);
    setSelectedMode(mode);

    try {
      // Fetch questions for the exam
      const questions = await fetchQuestionsByExamId(parseInt(id));

      const cloneQuestions = questions.map((q) => ({
        id: q.id,
        selectedAnswer: null,
        isCorrect: false,
        answers: q.answers.map((a) => ({
          id: a.id,
        })),
      }));

      // Shuffle questions
      const shuffledQuestions = shuffleArray<ExamResultQuestion>(cloneQuestions as ExamResultQuestion[]);

      shuffledQuestions.map((q) => {
        q.answers = shuffleArray<ExamResultQuestionAnswer>(q.answers as ExamResultQuestionAnswer[]);
      });

      // Save initial exam result with isCompleted = false
      const initialResult: ExamResult = {
        examId: parseInt(id),
        examType: mode as ExamType,
        questions: shuffledQuestions
      };

      await initializeExamResult(initialResult);
      await router.push(`${id}/${mode}`);
    } catch (error) {
      console.error("Error starting exam:", error);
      setIsStarting(false);
      setSelectedMode(null);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchExam = async () => {
      try {
        const examData = getExamById(parseInt(id));

        if (examData) {
          setExam(examData);
        } else {
          setError(true);
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to load exam details:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-blue-600 text-lg">Loading exam details...</p>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">
          Failed to load exam details. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Back Button */}
      <div className="mb-3 flex justify-between items-center">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Exams</span>
        </Link>

        {/* Result Link */}
        <Link
          href={`/exams/${id}/result`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition duration-300"
        >
          <ChartBarIcon className="w-5 h-5 mr-2" />
          <span>Xem kết quả</span>
        </Link>
      </div>

      {/* Exam Details Card */}
      <div className="w-full lg:w-4xl mx-auto bg-white rounded-sm shadow-lg p-6 md:p-8">
        {/* Exam Logo */}
        <div className="flex justify-center mb-6">
          <Image
            width={128}
            height={128}
            src={exam.imageUrl}
            alt={exam.name}
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>

        {/* Exam Name */}
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-4">
          {exam.name}
        </h2>

        {/* Exam Description */}
        <p className="text-gray-600 text-lg text-center mb-6">
          {exam.description}
        </p>

        {/* Updated At */}
        <div className="flex items-center justify-center text-sm text-gray-500 mb-6">
          <UpdateIcon className="w-4 h-4 mr-1" />
          <span>Cập nhật: {exam.updatedAt}</span>
        </div>

        {/* Categories */}
        {/* <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Categories
          </h3>
          <ul className="list-disc list-inside space-y-2">
            {exam.categories.map((category, index) => (
              <li key={index} className="text-gray-600">
                {category.name}
              </li>
            ))}
          </ul>
        </div> */}

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8">
          {/* Exam Mode Card */}
          <div className="bg-white rounded-sm p-4 sm:p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300">
            <div className="flex flex-col h-full">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 sm:gap-0">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-600">Chế độ thi</h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-sm text-gray-600 mb-2 sm:mb-4">
                <div className="flex items-center">
                  <ClipboardDocumentIcon className="w-4 h-4 mr-1 text-blue-500" />
                  <span>{exam.questionCount} câu</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1 text-blue-500" />
                  <span>{exam.duration} phút</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-1 text-blue-500" />
                  <span>Đậu: {exam.passScore}%</span>
                </div>
              </div>

              <div className="flex-grow">
                <ul className="space-y-2 sm:space-y-3 text-gray-600 mb-4 sm:mb-6">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm sm:text-base">Thời gian làm bài giới hạn</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm sm:text-base">Không hiển thị kết quả ngay sau khi trả lời</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm sm:text-base">Xem kết quả và giải thích sau khi hoàn thành bài thi</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleStartExam('exam')}
                disabled={isStarting}
                className={`w-full cursor-pointer bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-sm shadow-md transition duration-300 flex items-center justify-center ${isStarting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
              >
                <span className="text-sm sm:text-base">Bắt đầu thi</span>
                {isStarting && selectedMode === 'exam' && (
                  <LoadingIcon />
                )}
                {!isStarting && (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Practice Mode Card */}
          <div className="bg-white rounded-sm p-4 sm:p-6 border border-green-200 hover:border-green-400 transition-all duration-300">
            <div className="flex flex-col h-full">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 sm:gap-0">
                <h3 className="text-xl sm:text-2xl font-bold text-green-600">Chế độ luyện tập</h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-sm text-gray-600 mb-2 sm:mb-4">
                <div className="flex items-center">
                  <ClipboardDocumentIcon className="w-4 h-4 mr-1 text-green-500" />
                  <span>{exam.questionCount} câu</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1 text-green-500" />
                  <span>Không có</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-1 text-green-500" />
                  <span>Không có</span>
                </div>
              </div>

              <div className="flex-grow">
                <ul className="space-y-2 sm:space-y-3 text-gray-600 mb-4 sm:mb-6">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm sm:text-base">Không giới hạn thời gian làm bài</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm sm:text-base">Xem kết quả và giải thích ngay sau khi trả lời</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm sm:text-base">Thoải mái thử nghiệm và học hỏi</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleStartExam('practice')}
                disabled={isStarting}
                className={`w-full cursor-pointer bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-sm shadow-md transition duration-300 flex items-center justify-center ${isStarting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                  }`}
              >
                <span className="text-sm sm:text-base">Bắt đầu luyện tập</span>
                {isStarting && selectedMode === 'practice' && (
                  <LoadingIcon />
                )}
                {!isStarting && (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}