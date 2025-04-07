import React from "react";
import { Question } from "@/types/question";
import QuestionItem from "./QuestionItem";
import { FILTER_OPTION_VALUE, FILTER_OPTIONS } from "@/constants/constants";

interface QuestionListProps {
  questions: Question[];
  selectedQuestionId: number | null;
  bookmarkedQuestions: number[];
  filter: string;
  onFilterChange: (filter: string) => void;
  onQuestionSelect: (questionId: number) => void;
  onToggleBookmark: (questionId: number) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  selectedQuestionId,
  bookmarkedQuestions,
  filter,
  onFilterChange,
  onQuestionSelect,
  onToggleBookmark,
}) => {
  const filteredQuestions = questions.filter((question) => {
    switch (filter) {
      case FILTER_OPTION_VALUE.UNANSWERED:
        return !question.answered;
      case FILTER_OPTION_VALUE.ANSWERED:
        return question.answered;
      case FILTER_OPTION_VALUE.BOOKMARKED:
        return bookmarkedQuestions.includes(question.id);
      case FILTER_OPTION_VALUE.CORRECT:
        return question.correct;
      case FILTER_OPTION_VALUE.INCORRECT:
        return !question.correct;
      default:
        return true;
    }
  });

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Danh sách câu hỏi</h2>
      <div className="mb-4">
        <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
          Lọc câu hỏi
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <ul className="space-y-0">
        {filteredQuestions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            isSelected={selectedQuestionId === question.id}
            isBookmarked={bookmarkedQuestions.includes(question.id)}
            onSelect={() => onQuestionSelect(question.id)}
            onToggleBookmark={() => onToggleBookmark(question.id)}
          />
        ))}
      </ul>
    </>
  );
};

export default QuestionList;