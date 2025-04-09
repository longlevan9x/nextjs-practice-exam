"use client"
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuestionList from "./QuestionList";
import QuestionDetail from "./QuestionDetail";
import Timer from "./Timer";
import ProgressBar from "./ProgressBar";
import { Question } from "@/types/question";
import { fetchQuestionsByExamId } from "@/services/questionService";
import { saveExamResultByResultId } from "@/services/localStorageService";
import { TIMER_INITIAL_VALUE } from "@/constants/constants";
import { getExamById } from "@/services/examService";
import { ExamDomain } from "@/types/exam";
import { EXAM_TYPES, DISPLAY_MODES, ExamType, DisplayMode } from "@/constants/exam";
import LoadingIcon from "../common/LoadingIcon";
import { getAllExamResults } from "@/services/localStorageService";
import { ExamResult } from "@/types/ExamResult";

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
    const [currentExam, setCurrentExam] = useState<ExamResult | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Get incomplete exam result
                const results = getAllExamResults(examId);
                const incompleteExam = results.find(result => result.isCompleted === false);

                if (incompleteExam) {
                    setCurrentExam(incompleteExam);
                    // Convert ExamResult.Question to questionService.Question
                    const convertedQuestions = incompleteExam.questions;

                    // Fetch original questions to get answers and explanations
                    const originalQuestions = await fetchQuestionsByExamId(examId);
                    const questionsWithDetails = originalQuestions.map(originalQuestion => {
                        const converted = convertedQuestions.find(q => q.id === originalQuestion.id);
                        return {
                            ...originalQuestion,
                            selectedAnswer: converted?.selectedAnswer,
                            isCorrect: converted?.isCorrect,
                            answered: converted?.selectedAnswer !== null,
                        };
                    });

                    console.log(questionsWithDetails);
                    setQuestions(questionsWithDetails);
                    setSelectedQuestion(questionsWithDetails[0]);
                } else {
                    // This here redirect to the exam page
                    router.push(`/exams/${examId}`);
                }
            } catch (error) {
                console.error("Error loading questions:", error);
            }
        };

        fetchQuestions();
    }, [examId]);

    useEffect(() => {
        if (examId) {
            const exam = getExamById(examId);
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
        setSelectedQuestion(question || null);
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

    const saveExamData = (updatedQuestions: Question[]) => {
        if (currentExam?.resultId) {
            const examResultData = {
                ...currentExam,
                questions: updatedQuestions.map((q) => ({
                    id: q.id,
                    question: q.question,
                    selectedAnswer: q.selectedAnswer,
                    corrects: q.corrects,
                    isCorrect: q.isCorrect,
                    domain: q.domain,
                }))
            };

            saveExamResultByResultId(parseInt(examId), currentExam.resultId, examResultData);
        }
    };

    const handleCheckAnswer = () => {
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

        saveExamData(updatedQuestions);
    };

    const handleNextQuestion = () => {
        if (!selectedQuestion || testEnded) return;

        // Lưu dữ liệu câu trả lời nếu đang ở chế độ exam
        if (examType === EXAM_TYPES.EXAM && selectedQuestion.selectedAnswer) {
            const updatedQuestions = questions.map((q) => {
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
            saveExamData(updatedQuestions);
        }

        const currentIndex = questions.findIndex((q) => q.id === selectedQuestion.id);
        const nextQuestion = questions[currentIndex + 1];
        if (nextQuestion) {
            setSelectedQuestion(nextQuestion);
        }
    };

    const handlePreviousQuestion = () => {
        if (!selectedQuestion || testEnded) return;

        const currentIndex = questions.findIndex((q) => q.id === selectedQuestion.id);
        const previousQuestion = questions[currentIndex - 1];
        if (previousQuestion) {
            setSelectedQuestion(previousQuestion);
        }
    };

    const handleSkipQuestion = () => {
        if (!selectedQuestion || testEnded || displayMode === DISPLAY_MODES.REVIEW) return;
        handleNextQuestion();
    };

    const handleFinishTest = async () => {
        if (displayMode === DISPLAY_MODES.REVIEW) return;

        try {
            setIsFinishing(true);
            const examResultData = {
                ...currentExam,
                questions: questions.map((q) => ({
                    id: q.id,
                    question: q.question,
                    selectedAnswer: q.selectedAnswer,
                    corrects: q.corrects,
                    isCorrect: q.isCorrect,
                    domain: q.domain,
                })),
                isCompleted: true
            };

            if (currentExam?.resultId) {
                await saveExamResultByResultId(parseInt(examId), currentExam.resultId, examResultData);
            }

            await router.push('result');
        } catch (error) {
            console.error('Error finishing test:', error);
            setIsFinishing(false);
        }
    };

    const isFirstQuestion = questions.length > 0 && selectedQuestion?.id === questions[0].id;

    return (
        <div className="text-gray-900 grid grid-cols-12 -mr-4">
            {/* Question List Section */}
            <div className="lg:col-span-3 col-span-12">
                <div className="overflow-y-auto max-h-[calc(100vh-140px)] pb-10">
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
            <div className="lg:col-span-9 col-span-12 overflow-auto max-h-[calc(100vh-170px)]">
                <div className="w-full lg:max-w-4xl mx-auto">
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
                                    className={`cursor-pointer whitespace-pre border-2 border-blue-600 bg-white text-gray-900 px-6 py-2 rounded-sm transition duration-300 flex items-center justify-center ${isFinishing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
                                        }`}
                                >
                                    <span>Kết thúc bài kiểm tra</span>
                                    {isFinishing && <LoadingIcon />}
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
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
        </div>
    );
};

export default ExamPracticeLayout; 