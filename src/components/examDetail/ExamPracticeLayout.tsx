"use client"
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import QuestionList from "@/components/examDetail/QuestionList";
import QuestionDetail from "@/components/examDetail/QuestionDetail";
import Timer from "@/components/examDetail/Timer";
import ProgressBar from "@/components/examDetail/ProgressBar";
import { Answer, Question } from "@/types/question";
import { fetchQuestionsByExamId } from "@/services/questionService";
import { getExamById } from "@/services/examService";
import { Exam, ExamDomain } from "@/types/exam";
import { EXAM_TYPES, DISPLAY_MODES, ExamType, DisplayMode } from "@/constants/exam";
import LoadingIcon from "@/components/common/LoadingIcon";
import { ExamResult, ExamResultQuestion } from "@/types/ExamResult";
import * as examResultService from '@/services/examResultService';
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
    const [testEnded] = useState<boolean>(false);
    const [isFinishing, setIsFinishing] = useState<boolean>(false);
    const [currentExamResult, setCurrentExamResult] = useState<ExamResult | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [exam, setExam] = useState<Exam | null>(null);
    const [checkingAnswer, setCheckingAnswer] = useState<boolean>(false);
    const [isBacking, setIsBacking] = useState<boolean>(false);

    const router = useRouter();

    const _convertExamResultToQuestions = useCallback((convertedQuestions: ExamResultQuestion[], originalQuestions: Question[]): Question[] => {
        return convertedQuestions.map((convertedQuestion: ExamResultQuestion) => {
            const originalQuestion = originalQuestions.find(originalQuestion => originalQuestion.id === convertedQuestion.id);

            const answers = convertedQuestion.answers.map((a) => {
                const originalAnswer = originalQuestion?.answers.find(originalAnswer => originalAnswer.id === a.id);
                return {
                    ...originalAnswer,
                    correct: originalAnswer?.correct,
                };
            }) as Answer[];

            return {
                ...originalQuestion,
                questionIndex: convertedQuestion.questionIndex,
                selectedAnswer: convertedQuestion.selectedAnswer,
                isCorrect: convertedQuestion.isCorrect,
                answered: convertedQuestion.selectedAnswer !== null,
                showExplanation: examType === EXAM_TYPES.PRACTICE && convertedQuestion.selectedAnswer !== null,
                answers: answers,
            };
        }) as Question[];
    }, [examType]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const incompleteExam = await examResultService.getIncompleteExamResult(examId);
                if (incompleteExam) {
                    setCurrentExamResult(incompleteExam);
                    const convertedQuestions = incompleteExam.questions;
                    const originalQuestions = await fetchQuestionsByExamId(parseInt(examId));

                    const questionsWithDetails = _convertExamResultToQuestions(convertedQuestions, originalQuestions);

                    setQuestions(questionsWithDetails);
                    const initialIndex = incompleteExam.currentQuestionIndex || 0;
                    setCurrentQuestionIndex(initialIndex);
                    setSelectedQuestion(questionsWithDetails[initialIndex]);
                } else {
                    router.push(`/exams/${examId}`);
                }
            } catch (error) {
                console.error("Error loading questions:", error);
            }
        };

        fetchQuestions();
    }, [examId, examType, displayMode, router, _convertExamResultToQuestions]);

    useEffect(() => {
        if (examId) {
            const exam = getExamById(parseInt(examId));
            setExam(exam);
            if (exam?.domains) {
                setDomains(exam.domains);
            }
        }
    }, [examId]);

    const _updateCurrentExamResultState = (examResult: ExamResult | object): ExamResult | null => {
        if (!currentExamResult?.resultId) {
            return null;
        }

        const updatedResult = {
            ...currentExamResult,
            ...examResult
        };

        setCurrentExamResult(updatedResult);

        return updatedResult;
    }

    const _saveExamResult = async (examResult: ExamResult | object) => {
        try {
            const updatedResult = _updateCurrentExamResultState(examResult);
            await examResultService.updateExamResultData(currentExamResult?.resultId, updatedResult as ExamResult);
        } catch (error) {
            handleHttpError(error as ApiError, 'Có lỗi xảy ra khi lưu kết quả bài kiểm tra. Vui lòng thử lại sau.');
            throw error;
        }
    };

    const _isExamType = () => {
        return examType === EXAM_TYPES.EXAM;
    }

    const handleQuestionSelect = async (questionIndex: number) => {
        if (testEnded) return;

        const question = questions[questionIndex];
        setSelectedQuestion(question);
        setCurrentQuestionIndex(questionIndex);

        await _saveExamResult({ currentQuestionIndex: questionIndex });
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

    // Thêm hàm helper để kiểm tra tính đúng sai của câu trả lời
    const checkAnswerCorrectness = (question: Question): boolean => {
        if (!question.selectedAnswer) return false;

        if (question.multiple) {
            const selectedAnswers = Array.isArray(question.selectedAnswer) ? question.selectedAnswer : [];
            const correctAnswers = question.answers.filter(a => a.correct).map(a => a.id);

            return selectedAnswers.length === correctAnswers.length &&
                selectedAnswers.every(id => correctAnswers.includes(id));
        } else {
            return question.answers.some(a => a.id === question.selectedAnswer && a.correct);
        }
    };

    const _onCheckAnswer = async (selectedQuestion: Question, options: object): Promise<Question[]> => {
        const updatedQuestions = [...questions];

        const isCorrect = checkAnswerCorrectness(selectedQuestion);
        updatedQuestions[currentQuestionIndex] = {
            ...selectedQuestion,
            answered: true,
            isCorrect: isCorrect,
            incorrect: !isCorrect,
            ...options
        };

        await _saveExamResult({ questions: updatedQuestions });

        setQuestions(updatedQuestions);
        setSelectedQuestion(updatedQuestions[currentQuestionIndex]);

        return updatedQuestions;
    }

    const handleCheckAnswer = async () => {
        if (!selectedQuestion || testEnded || displayMode === DISPLAY_MODES.REVIEW) return;

        try {
            setCheckingAnswer(true);
            await _onCheckAnswer(selectedQuestion, {
                showExplanation: true,
            });
        }
        catch (error) {
            console.error('Error checking answer:', error);
        }
        finally {
            setCheckingAnswer(false);
        }
    };

    const _getNextQuestionIndex = (currentIndex: number) => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < questions.length) {
            return nextIndex;
        } else {
            return currentIndex; // Hoặc một giá trị nào đó để chỉ ra không còn câu hỏi nào nữa
        }
    };

    const _getPreviousQuestionIndex = (currentIndex: number) => {
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
            return prevIndex;
        } else {
            return currentIndex;
        }
    };

    const _handleChangeQuestionIndex = (questionIndex: number) => {
        if (questionIndex < questions.length && questionIndex >= 0) {
            setCurrentQuestionIndex(questionIndex);
            setSelectedQuestion(questions[questionIndex]);
        }

        return questionIndex;
    };

    const handleNextQuestion = async () => {
        if (!selectedQuestion || testEnded) return;

        try {
            setCheckingAnswer(true);
            let updatedQuestions = [...questions];
            const nextIndex = _getNextQuestionIndex(currentQuestionIndex);

            // Lưu dữ liệu câu trả lời nếu đang ở chế độ exam
            if (examType === EXAM_TYPES.EXAM && selectedQuestion.selectedAnswer) {
                updatedQuestions = await _onCheckAnswer(selectedQuestion, { currentQuestionIndex: nextIndex });
            }
            else {
                await _saveExamResult({ questions: updatedQuestions, currentQuestionIndex: nextIndex });
            }

            _handleChangeQuestionIndex(nextIndex);
        } catch (error) {
            console.error('Error handling next question:', error);
        } finally {
            setCheckingAnswer(false);
        }
    };

    const handlePreviousQuestion = async () => {
        if (!selectedQuestion || testEnded) return;

        try {
            setIsBacking(true);
            const prevIndex = _getPreviousQuestionIndex(currentQuestionIndex);
            await _saveExamResult({ currentQuestionIndex: prevIndex });
            _handleChangeQuestionIndex(prevIndex);
        }
        catch (error) {
            console.error('Error handling previous question:', error);
        }
        finally {
            setIsBacking(false);
        }
    };

    const handleSkipQuestion = () => {
        if (!selectedQuestion || testEnded || displayMode === DISPLAY_MODES.REVIEW) return;
        handleNextQuestion();
    };

    const handleFinishTest = async () => {
        if (isFinishing) return;

        try {
            setIsFinishing(true);

            let finishQuestions = [...questions];
            if (_isExamType() && selectedQuestion) {
                finishQuestions = await _onCheckAnswer(selectedQuestion, {});
            }

            const endTime = new Date().toISOString();
            const examResultData = {
                ...currentExamResult,
                endTime,
                isCompleted: true,
                questions: finishQuestions
            };

            // Cập nhật dữ liệu trước khi chuyển trang
            await examResultService.updateExamResultData(currentExamResult?.resultId || '', examResultData as ExamResult);

            // Chỉ chuyển trang khi cập nhật thành công
            router.push(`/exams/${examId}/result`);
            // setIsFinishing(false);
        } catch (error) {
            console.error('Error finishing test:', error);
            // Sử dụng hệ thống thông báo mới
            if (error instanceof ApiError) {
                handleHttpError(error, 'Có lỗi xảy ra khi kết thúc bài kiểm tra. Vui lòng kiểm tra kết nối mạng và thử lại.');
            }
            setIsFinishing(false);
        }
    };

    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

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
                                {(examType === EXAM_TYPES.EXAM && currentExamResult?.startTime && exam?.duration && displayMode === DISPLAY_MODES.EXECUTE) &&
                                    <Timer startTime={currentExamResult?.startTime} duration={exam?.duration} />
                                }
                            </div>
                        )}

                        {displayMode === DISPLAY_MODES.EXECUTE && (
                            <div className="flex justify-end">
                                <button
                                    onClick={handleFinishTest}
                                    disabled={isFinishing}
                                    className={`cursor-pointer whitespace-pre border-2 border-blue-600 bg-white text-gray-900 px-2 py-1 lg:px-4 lg:py-2 rounded-xs transition duration-300 flex items-center justify-center ${isFinishing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:text-white'}`}
                                >
                                    <span>Kết thúc bài kiểm tra</span>
                                    {isFinishing && <LoadingIcon />}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={` pb-28 ${selectedQuestion?.showExplanation ? 'lg:pb-20' : 'lg:pb-0'}`}>
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
                            isLastQuestion={isLastQuestion ?? false}
                            examType={examType}
                            onSubmitExam={handleFinishTest ?? (() => { })}
                            isFinishing={isFinishing}
                            checkingAnswer={checkingAnswer}
                            isBacking={isBacking}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamPracticeLayout; 