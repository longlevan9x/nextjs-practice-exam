'use client';
import React, { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
import { BookmarkIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import questionsData from "@/data/questions/aws_saa_2023_1.json"; // Import the JSON file

interface Answer {
  id: number;
  answer: string;
  correct: boolean;
}

interface Question {
  id: number;
  question: string;
  answers: Answer[];
  explanation: string;
  domain: string;
  answered?: boolean;
  correct?: boolean;
  incorrect?: boolean;
  selectedAnswer?: number | null; // Track selected answer for each question
  showExplanation?: boolean; // Track explanation visibility for each question
}

export default function ExamModePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([]); // Track bookmarked questions
  const [filter, setFilter] = useState<string>("all"); // Track the selected filter

  useEffect(() => {
    // Load questions from the JSON file
    const fetchQuestions = async () => {
      const loadedQuestions: Question[] = questionsData.map((q: Question) => ({
        id: q.id,
        question: q.question,
        answers: q.answers,
        explanation: q.explanation,
        domain: q.domain,
        selectedAnswer: null, // Track selected answer for each question
        showExplanation: false, // Track explanation visibility for each question
      }));
      setQuestions(loadedQuestions);
      setSelectedQuestion(loadedQuestions[0]); // Default to the first question
    };

    fetchQuestions();
  }, []);

  const handleQuestionSelect = (questionId: number) => {
    const question = questions.find((q) => q.id === questionId);
    setSelectedQuestion(question || null);
  };

  const handleAnswerSelect = (answerId: number) => {
    if (!selectedQuestion) return;

    const updatedQuestions = questions.map((q) =>
      q.id === selectedQuestion.id ? { ...q, selectedAnswer: answerId } : q
    );
    setQuestions(updatedQuestions);
    setSelectedQuestion({ ...selectedQuestion, selectedAnswer: answerId });
  };

  const handleCheckAnswer = () => {
    if (!selectedQuestion) return;

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
    if (!selectedQuestion) return;

    const currentIndex = questions.findIndex((q) => q.id === selectedQuestion.id);
    const nextQuestion = questions[currentIndex + 1];
    if (nextQuestion) {
      setSelectedQuestion(nextQuestion);
    }
  };

  const toggleBookmark = (questionId: number) => {
    setBookmarkedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId) // Remove bookmark
        : [...prev, questionId] // Add bookmark
    );
  };

  const filteredQuestions = questions.filter((question) => {
    switch (filter) {
      case "unanswered":
        return !question.answered; // Show unanswered questions
      case "answered":
        return question.answered; // Show answered questions
      case "bookmarked":
        return bookmarkedQuestions.includes(question.id); // Show bookmarked questions
      case "correct":
        return question.correct; // Show correctly answered questions
      case "incorrect":
        return question.incorrect; // Show incorrectly answered questions
      default:
        return true; // Show all questions
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row">
      {/* Left Panel: Scrollable Question List */}
      <div className="bg-white w-full md:w-1/3 p-4 overflow-y-auto max-h-screen">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Danh sách câu hỏi</h2>

        {/* Dropdown Filter */}
        <div className="mb-4">
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
            Lọc câu hỏi
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả</option>
            <option value="unanswered">Chưa trả lời</option>
            <option value="answered">Đã trả lời</option>
            <option value="bookmarked">Đã đánh dấu</option>
            <option value="correct">Trả lời đúng</option>
            <option value="incorrect">Trả lời sai</option>
          </select>
        </div>

        {/* Question List */}
        <ul className="space-y-2">
          {filteredQuestions.map((question) => (
            <li
              key={question.id}
              onClick={() => handleQuestionSelect(question.id)}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedQuestion?.id === question.id
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 hover:bg-gray-200"
                }`}
            >


              {/* Question Number and Text */}
              <div className="flex-1 w-full">
                <div className="flex items-center mb-1">
                  {/* Bookmark Icon */}
                  <BookmarkIcon
                    className={`w-4 h-4 mr-2 ${bookmarkedQuestions.includes(question.id)
                      ? "text-blue-500"
                      : "text-gray-500"
                      }`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering question selection
                      toggleBookmark(question.id);
                    }}
                  />
                  <p className="text-base font-bold">Câu hỏi {question.id}</p>
                </div>
                <p
                  title={question.question}
                  className="text-base overflow-hidden overflow-ellipsis whitespace-nowrap"
                >
                  {question.question}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Panel: Selected Question */}
      <div className="flex-1 bg-white p-6">
        {selectedQuestion ? (
          <>
            {/* Question Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <BookmarkIcon
                  className={`w-5 h-5 mr-2 cursor-pointer ${bookmarkedQuestions.includes(selectedQuestion.id)
                    ? "text-blue-500"
                    : "text-gray-500"
                    }`}
                  onClick={() => toggleBookmark(selectedQuestion.id)}
                />
                <h2 className="text-lg font-semibold text-gray-800">
                  Câu hỏi {selectedQuestion.id}
                </h2>
              </div>
            </div>

            {/* Question Content */}
            <h2 className="text-xl text-gray-800 mb-4">{selectedQuestion.question}</h2>
            <ul className="space-y-4">
              {selectedQuestion.answers.map((answer) => (
                <li
                  key={answer.id}
                  className={`p-3 border rounded-lg flex items-center transition-all duration-300 ${selectedQuestion.showExplanation
                    ? answer.correct
                      ? "bg-green-100 border-green-500"
                      : selectedQuestion.selectedAnswer === answer.id
                        ? "bg-red-100 border-red-500"
                        : "border-gray-300"
                    : "hover:bg-gray-100 border-gray-300"
                    }`}
                >
                  {/* Larger Radio Button */}
                  <input
                    type="radio"
                    name="answer"
                    value={answer.id}
                    checked={selectedQuestion.selectedAnswer === answer.id}
                    onChange={() => handleAnswerSelect(answer.id)}
                    disabled={selectedQuestion.showExplanation} // Disable selection after checking the answer
                    className="mr-3 w-6 h-6 cursor-pointer"
                  />
                  <span className="flex-1">{answer.answer}</span>
                  {/* Icons for Correct/Incorrect */}
                  {selectedQuestion.showExplanation && answer.correct && (
                    <CheckCircleIcon className="w-5 h-5 text-green-500 ml-3" />
                  )}
                  {selectedQuestion.showExplanation && selectedQuestion.selectedAnswer === answer.id && !answer.correct && (
                    <XCircleIcon className="w-5 h-5 text-red-500 ml-3" />
                  )}
                </li>
              ))}
            </ul>
            {!selectedQuestion.showExplanation ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedQuestion.selectedAnswer === null} // Disable button if no answer is selected
                className={`cursor-pointer mt-6 px-4 py-2 rounded-lg transition duration-300 ${selectedQuestion.selectedAnswer === null
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                Kiểm tra trả lời
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="cursor-pointer mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
              >
                Next Question
              </button>
            )}
            {selectedQuestion.showExplanation && (
              <div
                className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800">Giải thích</h3>
                <p className="text-gray-600">{selectedQuestion.explanation}</p>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-600">Chọn một câu hỏi để xem chi tiết.</p>
        )}
      </div>
    </div>
  );
}