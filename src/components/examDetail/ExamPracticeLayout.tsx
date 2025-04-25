"use client"
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuestionList from "@/components/examDetail/QuestionList";
import QuestionDetail from "@/components/examDetail/QuestionDetail";
import Timer from "@/components/examDetail/Timer";
import ProgressBar from "@/components/examDetail/ProgressBar";
import { Question } from "@/types/question";
import { fetchQuestionsByExamId } from "@/services/questionService";
import { TIMER_INITIAL_VALUE } from "@/constants/constants";
import { getExamById } from "@/services/examService";
import { ExamDomain } from "@/types/exam";
import { EXAM_TYPES, DISPLAY_MODES, ExamType, DisplayMode } from "@/constants/exam";
import LoadingIcon from "@/components/common/LoadingIcon";
import { ExamResult, ExamResultQuestion } from "@/types/ExamResult";
import { updateExamResultData, getIncompleteExamResult } from '@/services/examResultService';
import ActionButtons from "@/components/examDetail/ActionButtons";
import { handleHttpError } from '@/services/notificationService';
import { ApiError } from "next/dist/server/api-utils";

interface ExamPracticeLayoutProps {
    examType: ExamType;
    displayMode: DisplayMode;
}

const ExamPracticeLayout: React.FC<ExamPracticeLayoutProps> = ({ examType, displayMode }) => {
    const { id: examId } = useParams<{ id: string }>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([]);
    const [filter, setFilter] = useState<string>("all");
    const [domainFilter, setDomainFilter] = useState<string>("all");
    const [domains, setDomains] = useState<ExamDomain[]>([]);
    const [remainingTime, setRemainingTime] = useState<number>(TIMER_INITIAL_VALUE);
    const [testEnded, setTestEnded] = useState<boolean>(false);
    const [isFinishing, setIsFinishing] = useState<boolean>(false);
    const [currentExamResult, setCurrentExamResult] = useState<ExamResult | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Get incomplete exam result
                const incompleteExam = await getIncompleteExamResult(examId);

                if (incompleteExam) {
                    setCurrentExamResult(incompleteExam);
                    // Convert ExamResult.Question to questionService.Question
                    const convertedQuestions = incompleteExam.questions;

                    // Fetch original questions to get answers and explanations
                    const originalQuestions = await fetchQuestionsByExamId(parseInt(examId));

                    const questionsWithDetails = convertedQuestions.map((convertedQuestion: ExamResultQuestion) => {
                        const originalQuestion = originalQuestions.find(originalQuestion => originalQuestion.id === convertedQuestion.id);

                        return {
                            ...originalQuestion,
                            questionIndex: convertedQuestion.questionIndex,
                            selectedAnswer: convertedQuestion.selectedAnswer,
                            isCorrect: convertedQuestion.isCorrect,
                            answered: convertedQuestion.selectedAnswer !== null,
                            showExplanation: examType === EXAM_TYPES.PRACTICE && convertedQuestion.selectedAnswer !== null
                        };
                    });

                    setQuestions(questionsWithDetails);
                    setSelectedQuestion(questionsWithDetails[incompleteExam?.currentQuestionIndex || 0]);
                } else {
                    // This here redirect to the exam page
                    router.push(`/exams/${examId}`);
                }
            } catch (error) {
                console.error("Error loading questions:", error);
            }
        };

        fetchQuestions();
    }, [examId, examType, displayMode, router]);

    useEffect(() => {
        if (examId) {
            const exam = getExamById(parseInt(examId));
            if (exam?.domains) {
                setDomains(exam.domains);
            }
        }
    }, [examId]);

    useEffect(() => {
        if (testEnded || examType === EXAM_TYPES.PRACTICE || displayMode === DISPLAY_MODES.REVIEW) return;

        const timer = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setTestEnded(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [testEnded, examType, displayMode]);

    const handleQuestionSelect = (questionId: number) => {
        if (testEnded) return;
        const question = questions.find((q) => q.id === questionId);
        if (question) {
            setSelectedQuestion(question);
            // Save current question index
            const currentIndex = questions.findIndex((q) => q.id === questionId);
            if (currentExamResult?.resultId) {
                const updatedResult = {
                    ...currentExamResult,
                    currentQuestionIndex: currentIndex
                };
                setCurrentExamResult(updatedResult);
                updateExamResultData(currentExamResult.resultId, updatedResult);
            }
        }
    };

    const toggleBookmark = (questionId: number) => {
        setBookmarkedQuestions((prev) =>
            prev.includes(questionId)
                ? prev.filter((id) => id !== questionId)
                : [...prev, questionId]
        );
    };

    const handleAnswerSelect = (answerId: number) => {
        if (!selectedQuestion || testEnded || displayMode === DISPLAY_MODES.REVIEW) return;
        if (examType === EXAM_TYPES.PRACTICE && selectedQuestion.answered) return;

        const updatedQuestions = questions.map((q) => {
            if (q.id === selectedQuestion.id) {
                if (q.multiple) {
                    const currentSelected = Array.isArray(q.selectedAnswer) ? q.selectedAnswer : [];
                    const newSelected = currentSelected.includes(answerId)
                        ? currentSelected.filter((id) => id !== answerId)
                        : [...currentSelected, answerId];
                    return { ...q, selectedAnswer: newSelected };
                } else {
                    return {
                        ...q,
                        selectedAnswer: q.selectedAnswer === answerId ? null : answerId,
                    };
                }
            }
            return q;
        });

        setQuestions(updatedQuestions);
        const updatedQuestion = updatedQuestions.find((q) => q.id === selectedQuestion.id);
        if (updatedQuestion) {
            setSelectedQuestion(updatedQuestion);
        }
    };

    const saveExamData = async (updatedQuestions: Question[]) => {
        if (currentExamResult?.resultId) {
            const examResultData = {
                ...currentExamResult,
                questions: updatedQuestions
            };

            await updateExamResultData(currentExamResult.resultId, examResultData as ExamResult);
        }
    };

    const handleCheckAnswer = async () => {
        if (!selectedQuestion || testEnded || displayMode === DISPLAY_MODES.REVIEW) return;

        const updatedQuestions = questions.map((q) => {
            if (q.id === selectedQuestion.id) {
                const isCorrect = q.multiple
                    ? Array.isArray(q.selectedAnswer) &&
                    q.selectedAnswer.length === q.answers.filter((a) => a.correct).length &&
                    q.selectedAnswer.every((id) => q.answers.find((a) => a.id === id)?.correct)
                    : q.answers.some((a) => a.id === q.selectedAnswer && a.correct);

                return {
                    ...q,
                    showExplanation: true,
                    answered: true,
                    isCorrect: isCorrect,
                    incorrect: !isCorrect,
                };
            }
            return q;
        });

        setQuestions(updatedQuestions);
        const updatedQuestion = updatedQuestions.find((q) => q.id === selectedQuestion.id);
        if (updatedQuestion) {
            setSelectedQuestion(updatedQuestion);
        }

        await saveExamData(updatedQuestions);
    };

    const handleNextQuestion = async () => {
        if (!selectedQuestion || testEnded) return;

        let updatedQuestions = questions;

        // Lưu dữ liệu câu trả lời nếu đang ở chế độ exam
        if (examType === EXAM_TYPES.EXAM && selectedQuestion.selectedAnswer) {
            updatedQuestions = questions.map((q) => {
                if (q.id === selectedQuestion.id) {
                    const isCorrect = q.multiple
                        ? Array.isArray(q.selectedAnswer) &&
                        q.selectedAnswer.length === q.answers.filter((a) => a.correct).length &&
                        q.selectedAnswer.every((id) => q.answers.find((a) => a.id === id)?.correct)
                        : q.answers.some((a) => a.id === q.selectedAnswer && a.correct);

                    return {
                        ...q,
                        answered: true,
                        isCorrect: isCorrect,
                        incorrect: !isCorrect,
                    };
                }
                return q;
            });

            setQuestions(updatedQuestions);

            // await saveExamData(updatedQuestions);
        }

        const currentIndex = questions.findIndex((q) => q.id === selectedQuestion.id);
        const nextQuestion = questions[currentIndex + 1];
        if (nextQuestion) {
            setSelectedQuestion(nextQuestion);
            // Save current question index
            if (currentExamResult?.resultId) {
                const updatedResult = {
                    ...currentExamResult,
                    currentQuestionIndex: currentIndex + 1,
                    questions: updatedQuestions as ExamResultQuestion[]
                };

                setCurrentExamResult(updatedResult);

                await updateExamResultData(currentExamResult.resultId, updatedResult);
            }
        }
    };

    const handlePreviousQuestion = () => {
        if (!selectedQuestion || testEnded) return;

        const currentIndex = questions.findIndex((q) => q.id === selectedQuestion.id);
        const previousQuestion = questions[currentIndex - 1];
        if (previousQuestion) {
            setSelectedQuestion(previousQuestion);
            // Save current question index
            if (currentExamResult?.resultId) {
                const updatedResult = {
                    ...currentExamResult,
                    currentQuestionIndex: currentIndex - 1
                };
                updateExamResultData(currentExamResult.resultId, updatedResult);
            }
        }
    };

    const handleSkipQuestion = () => {
        if (!selectedQuestion || testEnded || displayMode === DISPLAY_MODES.REVIEW) return;
        handleNextQuestion();
    };

    const handleFinishTest = async () => {
        setIsFinishing(true);
        try {
            const endTime = new Date().toISOString();
            const examResultData = {
                ...currentExamResult,
                endTime,
                isCompleted: true,
                questions: questions
            };

            // Cập nhật dữ liệu trước khi chuyển trang
            await updateExamResultData(currentExamResult?.resultId || '', examResultData as ExamResult);
            
            // Chỉ chuyển trang khi cập nhật thành công
            router.push(`/exams/${examId}/result`);
            setIsFinishing(false);

        } catch (error) {
            console.error('Error finishing test:', error);
            // Sử dụng hệ thống thông báo mới
            if (error instanceof ApiError) {
                handleHttpError(error, 'Có lỗi xảy ra khi kết thúc bài kiểm tra. Vui lòng kiểm tra kết nối mạng và thử lại.');
            }
            setIsFinishing(false);
        }
    };

    const isFirstQuestion = questions.length > 0 && selectedQuestion?.id === questions[0].id;

    return (
        <div className="text-gray-900 grid grid-cols-12 -mr-4">
            {/* Question List Section */}
            <div className="lg:col-span-4 xl:col-span-3 col-span-12">
                <div className="lg:pr-auto pr-4 h-full lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto z-20 relative bg-white">
                    <QuestionList
                        questions={questions}
                        selectedQuestionId={selectedQuestion?.id || null}
                        bookmarkedQuestions={bookmarkedQuestions}
                        filter={filter}
                        domainFilter={domainFilter}
                        domains={domains}
                        onFilterChange={setFilter}
                        onDomainFilterChange={setDomainFilter}
                        onQuestionSelect={handleQuestionSelect}
                        onToggleBookmark={toggleBookmark}
                        examType={examType}
                    />
                </div>
            </div>

            {/* Question Detail Section */}
            <div className="lg:col-span-8 xl:col-span-9 col-span-12 lg:pr-auto pr-4 lg:overflow-auto lg:max-h-[calc(100vh-170px)]">
                <div className="w-full  xl:max-w-4xl mx-auto xl:px-auto lg:px-4">
                    <div className="w-full flex items-center mb-6">
                        {displayMode === DISPLAY_MODES.EXECUTE && (
                            <div className="flex w-full items-center space-x-4 mr-4">
                                <ProgressBar current={questions.filter((q) => q.answered).length} total={questions.length} />
                                {examType === EXAM_TYPES.EXAM && <Timer remainingTime={remainingTime} />}
                            </div>
                        )}

                        {displayMode === DISPLAY_MODES.EXECUTE && (
                            <div className="flex justify-end">
                                <button
                                    onClick={handleFinishTest}
                                    disabled={isFinishing}
                                    className={`cursor-pointer whitespace-pre border-2 border-blue-600 bg-white text-gray-900 px-2 py-1 lg:px-6 lg:py-2 rounded-sm transition duration-300 flex items-center justify-center ${isFinishing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
                                        }`}
                                >
                                    <span>Kết thúc bài kiểm tra</span>
                                    {isFinishing && <LoadingIcon />}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className=" pb-20">
                        {selectedQuestion && (
                            <QuestionDetail
                                question={selectedQuestion}
                                isBookmarked={bookmarkedQuestions.includes(selectedQuestion.id)}
                                onToggleBookmark={() => toggleBookmark(selectedQuestion.id)}
                                onAnswerSelect={handleAnswerSelect}
                                onCheckAnswer={handleCheckAnswer}
                                onNextQuestion={handleNextQuestion}
                                onPreviousQuestion={handlePreviousQuestion}
                                onSkipQuestion={handleSkipQuestion}
                                testEnded={testEnded}
                                isFirstQuestion={isFirstQuestion}
                                displayMode={displayMode}
                                examType={examType}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Fixed Action Buttons */}
            {displayMode === DISPLAY_MODES.EXECUTE && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
                    <div className="w-full py-2 pr-4 lg:pr-16">
                        <ActionButtons
                            showExplanation={selectedQuestion?.showExplanation ?? false}
                            onCheckAnswer={handleCheckAnswer ?? (() => { })}
                            onNextQuestion={handleNextQuestion ?? (() => { })}
                            onPreviousQuestion={handlePreviousQuestion ?? (() => { })}
                            onSkipQuestion={handleSkipQuestion ?? (() => { })}
                            selectedAnswer={selectedQuestion?.selectedAnswer ?? null}
                            testEnded={testEnded}
                            isFirstQuestion={isFirstQuestion ?? false}
                            examType={examType}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamPracticeLayout; 