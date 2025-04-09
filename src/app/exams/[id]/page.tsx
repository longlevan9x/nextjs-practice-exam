'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Exam } from "@/types/exam";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ClipboardDocumentIcon, ClockIcon, CheckCircleIcon, ClockIcon as UpdateIcon } from '@heroicons/react/24/outline';
import LoadingIcon from "@/components/common/LoadingIcon";
import { createExamResult } from "@/services/localStorageService";
import { fetchQuestionsByExamId } from "@/services/questionService";
import { ExamResult } from "@/types/ExamResult";
import { ExamType } from "@/constants/exam";

export default function ExamDetailPage() {
  const { id } = useParams<{id: string}>(); // Get the "id" parameter from the URL
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
      const questions = await fetchQuestionsByExamId(id);
      
      // Save initial exam result with isCompleted = false
      const initialResult: ExamResult = {
        examId: id,
        examType: mode as ExamType,
        startTime: new Date().toISOString(),
        isCompleted: false,
        questions: questions.map(q => ({
          id: q.id,
          question: q.question,
          selectedAnswer: null,
          corrects: q.corrects,
          isCorrect: false,
          domain: q.domain || ''
        }))
      };
      
      createExamResult(id, initialResult);
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
        const response = await import("@/data/exams.json");
        const examData = response.default.find(
          (exam: Exam) => exam.id === parseInt(id)
        );
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
      <div className="mb-3">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Exams</span>
        </Link>
      </div>

      {/* Exam Details Card */}
      <div className="w-full lg:w-2/3 mx-auto bg-white rounded-sm shadow-lg p-6 md:p-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Exam Mode Card */}
          <div className="bg-white rounded-sm p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-blue-600">Chế độ thi</h3>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
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
              </div>
              <div className="flex-grow">
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Thời gian làm bài giới hạn</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Không hiển thị kết quả ngay sau khi trả lời</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Xem kết quả và giải thích sau khi hoàn thành bài thi</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleStartExam('exam')}
                disabled={isStarting}
                className={`w-full cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-sm shadow-md transition duration-300 flex items-center justify-center ${
                  isStarting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                <span>Bắt đầu thi</span>
                {isStarting && selectedMode === 'exam' && (
                  <LoadingIcon />
                )}
                {!isStarting && (
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Practice Mode Card */}
          <div className="bg-white rounded-sm p-6 border border-green-200 hover:border-green-400 transition-all duration-300">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-green-600">Chế độ luyện tập</h3>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
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
              </div>
              <div className="flex-grow">
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Không giới hạn thời gian làm bài</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Xem kết quả và giải thích ngay sau khi trả lời</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Thoải mái thử nghiệm và học hỏi</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleStartExam('practice')}
                disabled={isStarting}
                className={`w-full cursor-pointer bg-green-600 text-white px-6 py-3 rounded-sm shadow-md transition duration-300 flex items-center justify-center ${
                  isStarting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                }`}
              >
                <span>Bắt đầu luyện tập</span>
                {isStarting && selectedMode === 'practice' && (
                  <LoadingIcon />
                )}
                {!isStarting && (
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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