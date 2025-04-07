'use client';
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuestionList from "@/components/exams/QuestionList";
import QuestionDetail from "@/components/exams/QuestionDetail";
import Timer from "@/components/exams/Timer";
import ProgressBar from "@/components/exams/ProgressBar";
import { Question } from "@/types/question";
import { fetchQuestionsByExamId } from "../../../../services/questionService";
import { saveTestResults } from "@/services/localStorageService";
import { TIMER_INITIAL_VALUE } from "@/constants/constants";
import { getExamById } from "@/services/examService";
import { ExamDomain } from "@/types/exam";

export default function ExamModePage() {
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
    if (testEnded) return;

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
  }, [testEnded]);

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
    if (!selectedQuestion || testEnded) return;

    const updatedQuestions = questions.map((q) =>
      q.id === selectedQuestion.id ? { ...q, selectedAnswer: answerId } : q
    );
    setQuestions(updatedQuestions);
    setSelectedQuestion({ ...selectedQuestion, selectedAnswer: answerId });
  };

  const handleCheckAnswer = () => {
    if (!selectedQuestion || testEnded) return;

    const updatedQuestions = questions.map((q) =>
      q.id === selectedQuestion.id
        ? {
          ...q,
          showExplanation: true,
          answered: true,
          correct: q.answers.some((a) => a.id === q.selectedAnswer && a.correct),
          incorrect: !q.answers.some((a) => a.id === q.selectedAnswer && a.correct),
        }
        : q
    );
    setQuestions(updatedQuestions);
    setSelectedQuestion({
      ...selectedQuestion,
      showExplanation: true,
    });
  };

  const handleNextQuestion = () => {
    if (!selectedQuestion || testEnded) return;

    const currentIndex = questions.findIndex((q) => q.id === selectedQuestion.id);
    const nextQuestion = questions[currentIndex + 1];
    if (nextQuestion) {
      setSelectedQuestion(nextQuestion);
    }
  };

  const handleFinishTest = () => {
    // Prepare test data
    const testData = {
      examId,
      startTime: new Date().toISOString(), // Assuming you track the start time elsewhere
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

    // Save test data using the centralized service
    saveTestResults(examId, testData);

    // Redirect to the results page
    router.push('result');
  };

  return (
    <div className=" text-gray-900 grid grid-cols-12">
      <div className="lg:col-span-3 overflow-y-auto max-h-[calc(100vh-165px)] col-span-12 pb-10">
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
        />
      </div>
      <div className="grid grid-cols-12 px-12 py-6 lg:col-span-9 col-span-12">
        <div className="col-span-12 lg:col-span-8 lg:col-start-3">

          <div className="w-full flex items-center mb-6">
            {/* Progress Bar and Timer */}
            <div className="flex w-full items-center space-x-4 mr-4">
              <ProgressBar current={questions.filter((q) => q.answered).length} total={questions.length} />
              <Timer remainingTime={remainingTime} />
            </div>

            {/* Finish Exam Button */}
            <button
              onClick={handleFinishTest}
              className="cursor-pointer whitespace-pre px-4 py-2 border-2 border-blue-600 rounded-sm hover:bg-blue-600 hover:text-white transition duration-300"
            >
              Kết thúc bài kiểm tra
            </button>
          </div>

          {/* Main Content */}
          <div>
            {selectedQuestion && (
              <QuestionDetail
                question={selectedQuestion}
                isBookmarked={bookmarkedQuestions.includes(selectedQuestion.id)}
                onToggleBookmark={() => toggleBookmark(selectedQuestion.id)}
                onAnswerSelect={handleAnswerSelect}
                onCheckAnswer={handleCheckAnswer}
                onNextQuestion={handleNextQuestion}
                testEnded={testEnded}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}