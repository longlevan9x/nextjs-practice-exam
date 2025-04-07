"use client"
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuestionList from "./QuestionList";
import QuestionDetail from "./QuestionDetail";
import Timer from "./Timer";
import ProgressBar from "./ProgressBar";
import { Question } from "@/types/question";
import { fetchQuestionsByExamId } from "@/services/questionService";
import { saveTestResults } from "@/services/localStorageService";
import { TIMER_INITIAL_VALUE } from "@/constants/constants";
import { getExamById } from "@/services/examService";
import { ExamDomain } from "@/types/exam";
import { EXAM_TYPES, DISPLAY_MODES, ExamType, DisplayMode } from "@/constants/exam";

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
    const router = useRouter();

    useEffect(() => {
        const fetchQuestions = async () => {
            const loadedQuestions = await fetchQuestionsByExamId(examId);
            const initializedQuestions = loadedQuestions.map((q) => ({
                ...q,
                selectedAnswer: null,
                showExplanation: false,
            }));
            setQuestions(initializedQuestions);
            setSelectedQuestion(initializedQuestions[0]);
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
                    correct: isCorrect,
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
                        correct: isCorrect,
                        incorrect: !isCorrect,
                    };
                }
                return q;
            });
            setQuestions(updatedQuestions);
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

    const handleFinishTest = () => {
        if (examType === EXAM_TYPES.PRACTICE || displayMode === DISPLAY_MODES.REVIEW) return;

        const testData = {
            examId,
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            questions: questions.map((q) => ({
                id: q.id,
                question: q.question,
                selectedAnswer: q.selectedAnswer,
                correctAnswer: q.answers.find((a) => a.correct)?.id,
                isCorrect: q.correct,
                domain: q.domain,
            })),
        };

        saveTestResults(examId, testData);
        router.push('result');
    };

    const isFirstQuestion = questions.length > 0 && selectedQuestion?.id === questions[0].id;

    return (
        <div className="text-gray-900 grid grid-cols-12 gap-4">
            {/* Question List Section */}
            <div className="lg:col-span-3 col-span-12">
                <div className="overflow-y-auto max-h-[calc(100vh-165px)] pb-10">
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
            <div className="lg:col-span-9 col-span-12">
                <div className="w-full lg:max-w-4xl mx-auto">
                    <div className="w-full flex items-center mb-6">
                        {displayMode === DISPLAY_MODES.EXECUTE && (
                            <div className="flex w-full items-center space-x-4 mr-4">
                                <ProgressBar current={questions.filter((q) => q.answered).length} total={questions.length} />
                                {examType === EXAM_TYPES.EXAM && <Timer remainingTime={remainingTime} />}
                            </div>
                        )}

                        {displayMode === DISPLAY_MODES.EXECUTE && (
                            <button
                                onClick={handleFinishTest}
                                className="cursor-pointer whitespace-pre px-4 py-2 border-2 border-blue-600 rounded-sm hover:bg-blue-600 hover:text-white transition duration-300"
                            >
                                Kết thúc bài kiểm tra
                            </button>
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