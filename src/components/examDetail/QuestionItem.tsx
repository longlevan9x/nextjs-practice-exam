import React from "react";
import BookmarkButton from "./BookmarkButton";
import { Question } from "@/types/question";
import { EXAM_TYPES, ExamType } from "@/constants/exam";

interface QuestionItemProps {
    question: Question;
    isSelected: boolean;
    isBookmarked?: boolean;
    onSelect: () => void;
    onToggleBookmark: () => void;
    examType: ExamType;
    isMobile: boolean;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
    question,
    isSelected,
    isBookmarked,
    onSelect,
    onToggleBookmark,
    examType,
    isMobile,
}) => {
    const isExamMode = examType === EXAM_TYPES.EXAM;

    return (
        <li
            className={`flex flex-col lg:pl-4 py-3 rounded-xs transition-all duration-300 cursor-pointer
                ${isSelected ? "bg-blue-100 text-blue-800 dark:bg-slate-800 dark:text-blue-200 dark:hover:bg-slate-700" : "hover:bg-gray-200 dark:hover:bg-slate-800 dark:text-gray-200"}`}
            onClick={!isMobile ? onSelect : undefined}
        >
            <div className="px-2 lg:pl-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <BookmarkButton
                            isBookmarked={isBookmarked || false}
                            onToggle={onToggleBookmark}
                        />
                        <p className="text-base font-bold ml-1">Câu hỏi {(question.questionIndex !== undefined) && question.questionIndex + 1}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Answer Status */}
                        {isExamMode && question.answered && (
                            <span className="text-sm font-bold text-green-600">Đã trả lời</span>
                        )}
                        {!isExamMode && question.answered && (
                            <span
                                className={`text-sm font-bold ${question.isCorrect ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {question.isCorrect ? "Chính xác" : "Không chính xác"}
                            </span>
                        )}
                        {/* Select Button - Show on all devices with different styles */}
                        <button
                            onClick={onSelect}
                            className={`block lg:hidden px-2 py-1 cursor-pointer rounded-full text-xs font-medium ${isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                }`}
                        >
                            {isSelected ? "Đã chọn" : "Chọn"}
                        </button>
                    </div>
                </div>

                {/* Question Content */}
                <div className="mt-2 text-gray-700 dark:text-gray-400">
                    <div
                        className="text-base leading-normal overflow-hidden max-h-[1.5em] whitespace-nowrap text-ellipsis"
                        dangerouslySetInnerHTML={{ __html: question.question }}
                    />
                </div>
            </div>
        </li>
    );
};

export default QuestionItem;
