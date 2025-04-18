import React, { useRef, useEffect, useState } from "react";
import { Question } from "@/types/question";
import QuestionItem from "./QuestionItem";
import { FILTER_OPTION_VALUE, FILTER_OPTIONS } from "@/constants/constants";
import { ExamDomain } from "@/types/exam";
import { ExamType } from "@/constants/exam";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface QuestionListProps {
  questions: Question[];
  selectedQuestionId: number | null;
  bookmarkedQuestions: number[];
  filter: string;
  domainFilter: string;
  domains: ExamDomain[];
  onFilterChange: (filter: string) => void;
  onDomainFilterChange: (domainFilter: string) => void;
  onQuestionSelect: (questionId: number) => void;
  onToggleBookmark: (questionId: number) => void;
  examType: ExamType;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  selectedQuestionId,
  bookmarkedQuestions,
  filter,
  domainFilter,
  domains,
  onFilterChange,
  onDomainFilterChange,
  onQuestionSelect,
  onToggleBookmark,
  examType,
}) => {
  const selectedQuestionRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if screen is mobile/tablet (less than lg breakpoint)
    const checkScreenSize = () => {
      const isMobileView = window.innerWidth < 1024; // 1024px is the lg breakpoint in Tailwind
      setIsMobile(isMobileView);
      setIsCollapsed(isMobileView);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Scroll to selected question when list is expanded
  useEffect(() => {
    if (!isCollapsed && selectedQuestionId && selectedQuestionRef.current) {
      // Use setTimeout to ensure the DOM has updated before scrolling
      setTimeout(() => {
        selectedQuestionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [isCollapsed, selectedQuestionId]);

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
  };

  const handleQuestionSelect = (questionId: number) => {
    onQuestionSelect(questionId);
    // Collapse the list when a question is selected on mobile
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  const filteredQuestions = questions.filter((question) => {
    // Apply status filter
    const statusMatch = (() => {
      switch (filter) {
        case FILTER_OPTION_VALUE.UNANSWERED:
          return !question.answered;
        case FILTER_OPTION_VALUE.ANSWERED:
          return question.answered;
        case FILTER_OPTION_VALUE.BOOKMARKED:
          return bookmarkedQuestions.includes(question.id);
        case FILTER_OPTION_VALUE.CORRECT:
          return question.isCorrect;
        case FILTER_OPTION_VALUE.INCORRECT:
          return !question.isCorrect;
        default:
          return true;
      }
    })();

    // Apply domain filter
    const domainMatch = domainFilter === "all" ||
      question.domain === domainFilter;

    return statusMatch && domainMatch;
  });

  return (
    <>
      <div className="flex flex-col">
        <div className="sticky top-0 z-10 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Danh sách câu hỏi</h2>
            <button 
              onClick={handleToggleCollapse} 
              className="lg:hidden flex items-center justify-center bg-blue-100 text-blue-800 rounded-md px-4 py-2 min-w-[100px] active:bg-blue-200"
              aria-label={isCollapsed ? "Mở rộng danh sách câu hỏi" : "Thu gọn danh sách câu hỏi"}
            >
              {isCollapsed ? (
                <>
                  <ChevronRightIcon className="w-6 h-6 mr-1" />
                  <span className="font-medium">Mở rộng</span>
                </>
              ) : (
                <>
                  <ChevronLeftIcon className="w-6 h-6 mr-1" />
                  <span className="font-medium">Thu gọn</span>
                </>
              )}
            </button>
          </div>
          <div className={`mb-4 space-x-3 flex ${isCollapsed ? 'hidden transition-all duration-300' : 'transition-all duration-300'}`}>
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
            <select
              id="domainFilter"
              value={domainFilter}
              onChange={(e) => onDomainFilterChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả lĩnh vực</option>
              {domains.map((domain) => (
                <option key={domain.name} value={domain.name}>
                  {domain.name} ({domain.questionCount})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={`${isCollapsed ? 'hidden transition-all duration-300' : 'transition-all duration-300'}`}>
          <ul className="space-y-0">
            {filteredQuestions.map((question) => (
              <div className={`last:pb-72 cursor-pointer transition-colors duration-200`}
                ref={question.id === selectedQuestionId ? selectedQuestionRef : null} 
                key={question.id}
              >
                <QuestionItem
                  question={question}
                  isSelected={selectedQuestionId === question.id}
                  isBookmarked={bookmarkedQuestions.includes(question.id)}
                  onSelect={() => handleQuestionSelect(question.id)}
                  onToggleBookmark={() => onToggleBookmark(question.id)}
                  examType={examType}
                  isMobile={isMobile}
                />
              </div>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default QuestionList;