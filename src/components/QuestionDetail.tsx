import React from "react";
import { Question } from "@/types/question";
import BookmarkButton from "./BookmarkButton";
import AnswerOptions from "./AnswerOptions";

interface QuestionDetailProps {
  question: Question;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onAnswerSelect: (answerId: number) => void;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  testEnded: boolean;
}

const QuestionDetail: React.FC<QuestionDetailProps> = ({
  question,
  isBookmarked,
  onToggleBookmark,
  onAnswerSelect,
  onCheckAnswer,
  onNextQuestion,
  testEnded,
}) => {
  return (
    <div className="flex-1 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl text-gray-800">{question.question}</h2>
        <BookmarkButton isBookmarked={isBookmarked} onToggle={onToggleBookmark} />
      </div>
      <AnswerOptions
        answers={question.answers}
        selectedAnswer={question.selectedAnswer ?? null}
        showExplanation={question.showExplanation ?? false}
        correctAnswer={question.answers.find((a) => a.correct)?.id}
        onAnswerSelect={onAnswerSelect}
        testEnded={testEnded}
      />
      {!question.showExplanation ? (
        <button
          onClick={onCheckAnswer}
          disabled={question.selectedAnswer === null || testEnded}
          className={`cursor-pointer mt-6 px-4 py-2 rounded-sm transition duration-300 ${
            question.selectedAnswer === null || testEnded
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Kiểm tra đáp án
        </button>
      ) : (
        <button
          onClick={onNextQuestion}
          disabled={testEnded}
          className="cursor-pointer mt-6 px-4 py-2 bg-green-600 text-white rounded-b-sm hover:bg-green-700 transition duration-300"
        >
          Câu hỏi tiếp theo
        </button>
      )}
    </div>
  );
};

export default QuestionDetail;