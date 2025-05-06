'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { fetchQuestionsByExamId } from '@/services/questionService'; // Service để lấy danh sách câu hỏi gốc
import QuestionDetail from '@/components/examDetail/QuestionDetail'; // Import QuestionDetail component
import { Question } from '@/types/question';
import ResultHeader from '@/components/result/ResultHeader';
import { Exam } from '@/types/exam';
import { getExamById } from '@/services/examService';
import { ChevronLeftIcon, CheckCircleIcon, XCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid"; // Import Heroicons
import { DISPLAY_MODES } from '@/constants/exam';
import { ExamResult, ExamResultQuestion } from '@/types/ExamResult';
import { getExamResult } from '@/services/examResultService';
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
    const [selectedDomain, setSelectedDomain] = useState<string>('all');
    const [examResult, setExamResult] = useState<ExamResult | null>(null);
    const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
    const questionRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    // Fetch result and map data
    useEffect(() => {
        const fetchData = async () => {
            if (!resultId) return;

            const result = await getExamResult(examId, resultId);
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

            const mappedQuestions = result.questions.map((mappedQuestion: ExamResultQuestion) => {
                const originalQuestion = originalQuestions.find((q) => q.id === mappedQuestion.id);

                return {
                    id: originalQuestion?.id,
                    question: {
                        ...originalQuestion,
                        ...mappedQuestion,
                        ...{question: originalQuestion?.question}, // Merge original question text
                        showExplanation: true
                    }
                };
            });

            setMappedQuestions(mappedQuestions);
            setFilteredQuestions(mappedQuestions);
            setLoading(false);
        };

        fetchData();
    }, [resultId, examId]);


    useEffect(() => {
        if (examId) {
            const data = getExamById(parseInt(examId)); // Fetch data from localStorage
            if (data) {
                setResultData(data);
            }
        }
    }, [examId]);

    const scrollToQuestion = (questionId: number) => {
        const element = questionRefs.current.get(questionId);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActiveQuestion(questionId);
            }, 50);
        }
    };

    // Update filtered questions when filter mode or domain changes
    useEffect(() => {
        let filtered = [...mappedQuestions];

        // Apply status filter
        if (filterMode === 'correct') {
            filtered = filtered.filter((q) => q.question.isCorrect === true);
        } else if (filterMode === 'incorrect') {
            filtered = filtered.filter((q) => q.question.isCorrect === false);
        } else if (filterMode === 'skipped') {
            filtered = filtered.filter((q) => q.question.selectedAnswer === null);
        } else if (filterMode === 'bookmarked') {
            filtered = filtered.filter((q) => q.question.isBookmarked);
        }

        // Apply domain filter
        if (selectedDomain !== 'all') {
            filtered = filtered.filter((q) => q.question.domain === selectedDomain);
        }

        setFilteredQuestions(filtered);
    }, [filterMode, selectedDomain, mappedQuestions]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const totalQuestions = mappedQuestions.length;
    const correctQuestions = mappedQuestions.filter((q) => q.question.isCorrect === true).length;
    const incorrectQuestions = mappedQuestions.filter((q) => q.question.isCorrect === false).length;
    const skippedQuestions = mappedQuestions.filter((q) => q.question.selectedAnswer === null).length;
    const bookmarkedQuestions = mappedQuestions.filter((q) => q.question.isBookmarked).length;

    return (
        <div className="p-4 md:p-6 lg:max-w-4xl mx-auto relative">
            {resultData &&
                <div className="mb-6">
                    <ResultHeader resultData={resultData} examId={examId} />
                </div>
            }

            <div className="mb-4">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center px-1 py-2 text-blue-700 rounded-xs cursor-pointer hover:text-blue-800 hover:bg-gray-200 font-semibold"
                >
                    <ChevronLeftIcon className="w-5 h-5 mr-2" />
                    Quay lại phần tổng quan kết quả
                </button>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 lg:justify-between mb-4">
                <button
                    onClick={() => {
                        setFilterMode('all');
                        setFilteredQuestions(mappedQuestions);
                    }}
                    className={`px-4 py-2 rounded-xs cursor-pointer font-semibold ${filterMode === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Tất cả ({totalQuestions})
                </button>
                <button
                    onClick={() => {
                        setFilterMode('correct');
                        setFilteredQuestions(mappedQuestions.filter((q) => q.question.isCorrect === true));
                    }}
                    className={`px-4 py-2 rounded-xs cursor-pointer font-semibold ${filterMode === 'correct' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Chính xác ({correctQuestions})
                </button>
                <button
                    onClick={() => {
                        setFilterMode('incorrect');
                        setFilteredQuestions(mappedQuestions.filter((q) => q.question.isCorrect === false));
                    }}
                    className={`px-4 py-2 rounded-xs cursor-pointer font-semibold ${filterMode === 'incorrect' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Không chính xác ({incorrectQuestions})
                </button>
                <button
                    onClick={() => {
                        setFilterMode('skipped');
                        setFilteredQuestions(mappedQuestions.filter((q) => q.question.selectedAnswer === null));
                    }}
                    className={`px-4 py-2 rounded-xs cursor-pointer font-semibold ${filterMode === 'skipped' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Đã bỏ qua ({skippedQuestions})
                </button>
                <button
                    onClick={() => {
                        setFilterMode('bookmarked');
                        setFilteredQuestions(mappedQuestions.filter((q) => q.question.isBookmarked));
                    }}
                    className={`px-4 py-2 rounded-xs cursor-pointer font-semibold ${filterMode === 'bookmarked' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Đã đánh dấu ({bookmarkedQuestions})
                </button>
            </div>

            {/* Domain Filter */}
            <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedDomain('all')}
                        className={`px-4 py-2 rounded-xs cursor-pointer font-semibold ${selectedDomain === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Tất cả lĩnh vực
                    </button>
                    {resultData?.domains?.map((domain) => (
                        <button
                            key={domain.name}
                            onClick={() => setSelectedDomain(domain.name)}
                            className={`px-4 py-2 rounded-xs cursor-pointer font-semibold ${selectedDomain === domain.name ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {domain.name} ({mappedQuestions.filter(q => q.question.domain === domain.name).length})
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Navigation Sidebar */}
            <div className="fixed lg:right-4 bottom-4 right-0 left-0 lg:left-auto lg:top-1/2 lg:-translate-y-1/2 z-10 bg-white shadow-lg p-2 lg:p-3 rounded-lg lg:max-h-[80vh] overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden max-w-2/3 mx-auto lg:max-w-none">
                <div className="flex lg:flex-col gap-2 lg:max-w-none">
                    {filteredQuestions.map((question) => (
                        <button
                            key={question.id}
                            onClick={() => scrollToQuestion(question.id)}
                            className={`cursor-pointer w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 relative flex-shrink-0 ${activeQuestion === question.id
                                ? 'bg-blue-600 text-white scale-110'
                                : question.question.isCorrect
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : question.question.selectedAnswer === null
                                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                            title={`Câu ${(question.question.questionIndex ?? 0) + 1}: ${question.question.isCorrect
                                ? 'Chính xác'
                                : question.question.selectedAnswer === null
                                    ? 'Bỏ qua'
                                    : 'Không chính xác'
                                }`}
                        >
                            {(question.question.questionIndex ?? 0) + 1}
                            <span className="absolute -right-1 -top-1">
                                {question.question.isCorrect ? (
                                    <CheckCircleIcon className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                                ) : question.question.selectedAnswer === null ? (
                                    <MinusCircleIcon className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" />
                                ) : (
                                    <XCircleIcon className="w-3 h-3 lg:w-4 lg:h-4 text-red-600" />
                                )}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                {filteredQuestions.map((question) => (
                    <div
                        ref={(el) => {
                            if (el) {
                                questionRefs.current.set(question.id, el);
                            }
                        }}
                        className="border border-blue-200 p-4 rounded-xs h-auto"
                        key={question.id}
                    >
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
        </div >
    );
};

export default ResultOverviewPage;
