'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getExamResultById } from '@/services/localStorageService'; // Service để lấy kết quả thi
import { fetchQuestionsByExamId } from '@/services/questionService'; // Service để lấy danh sách câu hỏi gốc
import QuestionDetail from '@/components/QuestionDetail'; // Import QuestionDetail component
import { Question } from '@/types/question';
import ResultHeader from '@/components/result/ResultHeader';
import { Exam } from '@/types/exam';
import { getExamById } from '@/services/examService';
import { ChevronLeftIcon } from "@heroicons/react/24/solid"; // Import Heroicons

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
                }

                originalQuestion.showExplanation = true; // Hiển thị lời giải

                return {
                    id: originalQuestion.id,
                    question: originalQuestion,
                };
            });

            setMappedQuestions(mapped);
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
            
            <div className="space-y-6">
                {mappedQuestions.map((question) => (
                    <div className="border border-blue-200 p-4" key={question.id}>
                        <QuestionDetail
                            question={question.question}
                            isBookmarked={false}
                            testEnded={true}
                            mode='review'
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResultOverviewPage;