import React, { useState, useEffect } from "react";
import { Question } from "@/types/question";
import BookmarkButton from "./BookmarkButton";
import AnswerOptions from "./AnswerOptions";
import AnswerExplanation from "./AnswerExplanation";
import References from "./References";
import { ArrowUpIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

import {
  EXPLANATION_SECTION_TITLE,
  HEADER_TITLE_PREFIX,
} from "@/constants/constants";
import { DisplayMode, ExamType } from "@/constants/exam";

interface QuestionDetailProps {
  question: Question;
  isBookmarked: boolean;
  onToggleBookmark?: () => void;
  onAnswerSelect?: (answerId: number) => void;
  onCheckAnswer?: () => void;
  onNextQuestion?: () => void;
  onPreviousQuestion?: () => void;
  onSkipQuestion?: () => void;
  testEnded?: boolean;
  isFirstQuestion?: boolean;
  displayMode: DisplayMode;
  examType?: ExamType;
}

const QuestionDetail: React.FC<QuestionDetailProps> = ({
  question,
  isBookmarked,
  onToggleBookmark,
  onAnswerSelect,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getQuestionStatus = () => {
    if (!question.selectedAnswer) {
      return "Chưa trả lời";
    }
    if (question.showExplanation) {
      return question.isCorrect ? "Chính xác" : "Không chính xác";
    }
    return "Đã trả lời";
  };

  const getStatusColor = () => {
    if (!question.selectedAnswer) {
      return "text-gray-500";
    }
    if (question.showExplanation) {
      return question.isCorrect ? "text-green-600" : "text-red-600";
    }
    return "text-blue-600";
  };

  const handleToggle = () => {
    setIsTransitioning(true);
    setIsExpanded(!isExpanded);
    setTimeout(() => setIsTransitioning(false), 300); // Match transition duration
  };

  return (
    <div className="flex flex-col w-full">
      {/* Question Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <BookmarkButton isBookmarked={isBookmarked} onToggle={onToggleBookmark ?? (() => {})} />
            <h2 className="text-lg font-normal">
              {HEADER_TITLE_PREFIX} {(question.questionIndex !== undefined) && question.questionIndex + 1}
            </h2>
          </div>
          <span className={`text-base font-bold ${getStatusColor()}`}>
            {getQuestionStatus()}
          </span>
        </div>
        {question.showExplanation && (
          <button
            onClick={handleToggle}
            className={`relative z-10 cursor-pointer flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors duration-200 ${isTransitioning ? 'opacity-50' : ''}`}
            disabled={isTransitioning}
          >
            <span className="text-sm">{isExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
            <ChevronUpIcon className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-0' : 'rotate-180'}`} />
          </button>
        )}
      </div>

      <div className="mt-1 mb-4 [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:my-2 [&_pre]:font-mono [&_pre]:text-sm [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_img]:max-w-full [&_img]:h-auto">
        <p className="text-base" dangerouslySetInnerHTML={{ __html: question.question }} />
      </div>

      <div className={`transition-all duration-300 ease-in-out relative z-0 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0'}`}>
        {/* Answer Options */}
        <div className={`transition-all duration-300 ${isExpanded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <AnswerOptions
            answers={question.answers}
            selectedAnswer={question.selectedAnswer ?? null}
            showExplanation={question.showExplanation ?? false}
            onAnswerSelect={onAnswerSelect ?? (() => {})}
            multiple={question.multiple ?? false}
          />
        </div>

        {/* Explanation Section */}
        {question.showExplanation && (
          <div className={`mt-6 p-4 bg-gray-50 border border-gray-300 rounded-xs transition-all duration-300 delay-100 ${isExpanded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{EXPLANATION_SECTION_TITLE}</h3>

            {question.correctAnswerExplanations && (
              <AnswerExplanation
                answerExplanations={question.correctAnswerExplanations}
                type="correct"
              />
            )}

            {question.incorrectAnswerExplanations && question.incorrectAnswerExplanations.length > 0 && (
              <AnswerExplanation
                answerExplanations={question.incorrectAnswerExplanations}
                type="incorrect"
              />
            )}

            {question.references && question.references.length > 0 && (
              <References references={question.references} />
            )}
          </div>
        )}

        {/* Domain Section */}
        {(question.showExplanation && question.domain) && (
          <div className={`mt-4 p-3 border border-gray-300 rounded-xs bg-white transition-all duration-300 delay-200 ${isExpanded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <div className="flex flex-col space-y-2">
              <span className="font-bold text-lg">
                Lĩnh vực
              </span>
              <span className="font-medium">
                {question.domain}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-800 text-white p-3 hover:bg-blue-700 transition-all duration-200 z-50 hover:scale-110"
          aria-label="Lên đầu trang"
        >
          <ArrowUpIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default QuestionDetail;