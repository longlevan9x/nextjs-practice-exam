'use client';
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import QuestionList from "@/components/QuestionList";
import QuestionDetail from "@/components/QuestionDetail";
import Timer from "@/components/Timer";
import { Question } from "@/types/question";
import { fetchQuestionsByExamId } from "@/services/questionService";

export default function ExamModePage() {
  const { id: examId } = useParams<{id: string}>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [remainingTime, setRemainingTime] = useState<number>(600);
  const [testEnded, setTestEnded] = useState<boolean>(false);

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

  return (
    <div className="min-h-screen text-gray-900 flex flex-col md:flex-row">
      <QuestionList
        questions={questions}
        selectedQuestionId={selectedQuestion?.id || null}
        bookmarkedQuestions={bookmarkedQuestions}
        filter={filter}
        onFilterChange={setFilter}
        onQuestionSelect={handleQuestionSelect}
        onToggleBookmark={toggleBookmark}
      />
      <div className="flex-1 bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <Timer remainingTime={remainingTime} />
          <button
            onClick={() => setTestEnded(true)}
            className="px-4 py-2 border-2 border-blue-600 rounded-sm hover:bg-blue-600 hover:text-white transition duration-300"
          >
            Kết thúc bài kiểm tra
          </button>
        </div>
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
  );
}