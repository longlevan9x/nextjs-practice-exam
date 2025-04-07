'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getExamResultById } from '@/services/localStorageService'; // Service để lấy kết quả thi
import { fetchQuestionsByExamId } from '@/services/questionService'; // Service để lấy danh sách câu hỏi gốc
import QuestionDetail from '@/components/QuestionDetail'; // Import QuestionDetail component
import { Question } from '@/types/question';

interface MappedQuestion {
    id: number;
    question: Question;
}

const ResultOverviewPage: React.FC = () => {
    const { resultId } = useParams<{ resultId: string }>(); // Lấy resultId từ URL
    const [mappedQuestions, setMappedQuestions] = useState<MappedQuestion[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="p-6 lg:max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-6">Chi Tiết Kết Quả Thi</h1>
            <div className="space-y-6">
                {mappedQuestions.map((question) => (
                    <div className=" border border-blue-200 p-4">
                        <QuestionDetail
                            key={question.id}
                            question={question.question}
                            isBookmarked={false}
                            testEnded={true} // Assuming the test has ended in this context
                        ></QuestionDetail>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResultOverviewPage;