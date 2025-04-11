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

  useEffect(() => {
    // Check if screen is mobile/tablet (less than lg breakpoint)
    const checkScreenSize = () => {
      setIsCollapsed(window.innerWidth < 1024); // 1024px is the lg breakpoint in Tailwind
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  useEffect(() => {
    if (selectedQuestionId && selectedQuestionRef.current) {
      selectedQuestionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [selectedQuestionId]);

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
          <div className="flex justify-between items-center mb-4 ">
            <h2 className="text-xl font-bold text-gray-800">Danh sách câu hỏi</h2>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className=" lg:hidden hover:text-gray-800 hover:bg-gray-100 rounded-full cursor-pointer p-2">
              {isCollapsed ? <ChevronRightIcon className="w-5 h-5" title="Mở rộng" /> : <ChevronLeftIcon className="w-5 h-5" title="Thu gọn" />}
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
            <div ref={question.id === selectedQuestionId ? selectedQuestionRef : null} key={question.id}
              className="cursor-pointer transition-colors duration-200"
            >
              <QuestionItem
                key={question.id}
                question={question}
                isSelected={selectedQuestionId === question.id}
                isBookmarked={bookmarkedQuestions.includes(question.id)}
                onSelect={() => onQuestionSelect(question.id)}
                onToggleBookmark={() => onToggleBookmark(question.id)}
                examType={examType}
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