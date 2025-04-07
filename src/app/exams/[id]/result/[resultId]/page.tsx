'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getExamResultById } from '@/services/localStorageService'; // Service để lấy kết quả thi
import { fetchQuestionsByExamId } from '@/services/questionService'; // Service để lấy danh sách câu hỏi gốc
import QuestionDetail from '@/components/exams/QuestionDetail'; // Import QuestionDetail component
import { Question } from '@/types/question';
import ResultHeader from '@/components/result/ResultHeader';
import { Exam } from '@/types/exam';
import { getExamById } from '@/services/examService';
import { ChevronLeftIcon } from "@heroicons/react/24/solid"; // Import Heroicons
import { DISPLAY_MODES } from '@/constants/exam';
import { ExamResult } from '@/types/ExamResult';
interface MappedQuestion {
    id: number;
    question: Question;
}

const ResultOverviewPage: React.FC = () => {
    const { id: examId } = useParams<{ id: string }>();
    const { resultId } = useParams<{ resultId: string }>(); // Lấy resultId từ URL
    const [mappedQuestions, setMappedQuestions] = useState<MappedQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [resultData, setResultData] = useState<Exam | null>(null);
    const [filteredQuestions, setFilteredQuestions] = useState<MappedQuestion[]>([]);
    const [filterMode, setFilterMode] = useState<string>('all');
    const [examResult, setExamResult] = useState<ExamResult | null>(null);

    // Fetch result and map data
    useEffect(() => {
        const fetchData = async () => {
            if (!resultId) return;

            // Lấy kết quả thi từ localStorage
            const result = getExamResultById(resultId);
            if (!result) {
                console.error('Không tìm thấy kết quả thi.');
                setLoading(false);
                return;
            }

            setExamResult(result);

            // Lấy danh sách câu hỏi gốc từ localStorage
            const originalQuestions = await fetchQuestionsByExamId(result.examId);
            if (!originalQuestions || originalQuestions.length === 0) {
                console.error('Không tìm thấy danh sách câu hỏi gốc.');
                setLoading(false);
                return;
            }

            // Map dữ liệu giữa câu hỏi gốc và câu trả lời của người dùng
            const mapped = originalQuestions.map((originalQuestion) => {
                const userQuestion = result.questions.find(
                    (q) => q.id === originalQuestion.id
                );

                if (userQuestion) {
                    originalQuestion.selectedAnswer = userQuestion.selectedAnswer;
                    originalQuestion.isCorrect = userQuestion.isCorrect;
                }

                originalQuestion.showExplanation = true; // Hiển thị lời giải

                return {
                    id: originalQuestion.id,
                    question: originalQuestion,
                };
            });

            setMappedQuestions(mapped);
            setFilteredQuestions(mapped);
            setLoading(false);
        };

        fetchData();
    }, [resultId]);


    useEffect(() => {
        if (examId) {
            const data = getExamById(examId); // Fetch data from localStorage
            if (data) {
                setResultData(data);
            }
        }
    }, [examId]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const totalQuestions = mappedQuestions.length;
    const correctQuestions = mappedQuestions.filter((q) => q.question.isCorrect === true).length;
    const incorrectQuestions = mappedQuestions.filter((q) => q.question.isCorrect === false).length;
    const skippedQuestions = mappedQuestions.filter((q) => q.question.selectedAnswer === null).length;
    const bookmarkedQuestions = mappedQuestions.filter((q) => q.question.isBookmarked).length;

    return (
        <div className="p-6 lg:max-w-4xl mx-auto">
            {resultData &&
                <div className="mb-6">
                    <ResultHeader resultData={resultData} examId={examId} />
                </div>
            }

            <div className="mb-4">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center px-1 py-2 text-blue-700 rounded-sm cursor-pointer hover:text-blue-800 hover:bg-gray-200 font-semibold"
                >
                    <ChevronLeftIcon className="w-5 h-5 mr-2" />
                    Quay lại phần tổng quan kết quả
                </button>
            </div>

            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => {
                        setFilterMode('all');
                        setFilteredQuestions(mappedQuestions);
                    }}
                    className={`px-4 py-2 rounded-sm font-semibold ${filterMode === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    Tất cả ({totalQuestions})
                </button>
                <button
                    onClick={() => {
                        setFilterMode('correct');
                        setFilteredQuestions(mappedQuestions.filter((q) => q.question.isCorrect === true));
                    }}
                    className={`px-4 py-2 rounded-sm font-semibold ${filterMode === 'correct' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    Chính xác ({correctQuestions})
                </button>
                <button
                    onClick={() => {
                        setFilterMode('incorrect');
                        setFilteredQuestions(mappedQuestions.filter((q) => q.question.isCorrect === false));
                    }}
                    className={`px-4 py-2 rounded-sm font-semibold ${filterMode === 'incorrect' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    Không chính xác ({incorrectQuestions})
                </button>
                <button
                    onClick={() => {
                        setFilterMode('skipped');
                        setFilteredQuestions(mappedQuestions.filter((q) => q.question.selectedAnswer === null));
                    }}
                    className={`px-4 py-2 rounded-sm font-semibold ${filterMode === 'skipped' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    Đã bỏ qua ({skippedQuestions})
                </button>
                <button
                    onClick={() => {
                        setFilterMode('bookmarked');
                        setFilteredQuestions(mappedQuestions.filter((q) => q.question.isBookmarked));
                    }}
                    className={`px-4 py-2 rounded-sm font-semibold ${filterMode === 'bookmarked' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                >
                    Đã đánh dấu ({bookmarkedQuestions})
                </button>
            </div>

            <div className="space-y-6">
                {filteredQuestions.map((question) => (
                    <div className="border border-blue-200 p-4" key={question.id}>
                        <QuestionDetail
                            question={question.question}
                            isBookmarked={false}
                            testEnded={true}
                            displayMode={DISPLAY_MODES.REVIEW}
                            examType={examResult?.examType}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResultOverviewPage;