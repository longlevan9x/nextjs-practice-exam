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
  filter: string;
  domainFilter: string;
  domains: ExamDomain[];
  onFilterChange: (filter: string) => void;
  onDomainFilterChange: (domainFilter: string) => void;
  onQuestionSelect: (questionIndex: number) => void;
  onToggleBookmark: (questionIndex: number) => void;
  examType: ExamType;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  selectedQuestionId,
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
    let previousWidth = 0;

    // Check if screen is mobile/tablet (less than lg breakpoint)
    const checkScreenSize = () => {
      const currentWidth = window.innerWidth;
      
      // Only update if width has changed
      if (currentWidth !== previousWidth) {
        const isMobileView = currentWidth < 1024; // 1024px is the xl breakpoint in Tailwind
        setIsMobile(isMobileView);
        setIsCollapsed(isMobileView);
        previousWidth = currentWidth;
      }

      previousWidth = currentWidth;
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

  const handleQuestionSelect = (questionIndex: number | undefined) => {
    if (questionIndex === undefined || questionIndex < 0) {
      return;
    }
    
    onQuestionSelect(questionIndex);
    // Collapse the list when a question is selected on mobile
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  const handleToggleBookmark = (questionIndex: number | undefined) => {
     if (questionIndex === undefined || questionIndex < 0) {
      return;
    }
    
    onToggleBookmark(questionIndex);
  }

  const filteredQuestions = questions.filter((question) => {
    // Apply status filter
    const statusMatch = (() => {
      switch (filter) {
        case FILTER_OPTION_VALUE.UNANSWERED:
          return !question.answered;
        case FILTER_OPTION_VALUE.ANSWERED:
          return question.answered;
        case FILTER_OPTION_VALUE.BOOKMARKED:
          return question.isBookmarked;
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
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 lg:pl-4 py-4 space-y-4 px-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-300">Danh sách câu hỏi</h2>
            <button 
              onClick={handleToggleCollapse} 
              className="cursor-pointer lg:hidden flex items-center justify-center bg-blue-100 text-blue-800 rounded-xs px-2 py-1 min-w-[100px] active:bg-blue-200"
              aria-label={isCollapsed ? "Mở rộng danh sách câu hỏi" : "Thu gọn danh sách câu hỏi"}
            >
              {isCollapsed ? (
                <>
                  <ChevronRightIcon className="w-5 h-5 mr-1" />
                  <span className="font-medium">Mở rộng</span>
                </>
              ) : (
                <>
                  <ChevronLeftIcon className="w-5 h-5 mr-1" />
                  <span className="font-medium">Thu gọn</span>
                </>
              )}
            </button>
          </div>
          <div className={`space-x-3 flex ${isCollapsed ? 'hidden transition-all duration-300' : 'transition-all duration-300'}`}>
            <select
              id="filter"
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="dark:text-gray-200 dark:dark:bg-gray-900 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="dark:text-gray-200 dark:dark:bg-gray-900 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <div className={`last:pb-24 xl:last:pb-72 cursor-pointer transition-colors duration-200`}
                ref={question.id === selectedQuestionId ? selectedQuestionRef : null} 
                key={question.id}
              >
                <QuestionItem
                  question={question}
                  isSelected={selectedQuestionId === question.id}
                  isBookmarked={question.isBookmarked}
                  onSelect={() => handleQuestionSelect(question.questionIndex)}
                  onToggleBookmark={() => handleToggleBookmark(question.questionIndex)}
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