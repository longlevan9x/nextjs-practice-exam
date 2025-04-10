import React from "react";
import BookmarkButton from "./BookmarkButton";
import { Question } from "@/types/question";
import { EXAM_TYPES, ExamType } from "@/constants/exam";

interface QuestionItemProps {
    question: Question;
    isSelected: boolean;
    isBookmarked: boolean;
    onSelect: () => void;
    onToggleBookmark: () => void;
    examType: ExamType;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
    question,
    isSelected,
    isBookmarked,
    onSelect,
    onToggleBookmark,
    examType,
}) => {
    const isExamMode = examType === EXAM_TYPES.EXAM;

    return (
        <li
            onClick={onSelect}
            className={`flex flex-col p-3 rounded-sm cursor-pointer transition-all duration-300 
                ${isSelected ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : "hover:bg-gray-200"}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <BookmarkButton
                        isBookmarked={isBookmarked}
                        onToggle={onToggleBookmark}
                    />
                    <p className="text-base font-bold ml-1">Câu hỏi {(question.questionIndex !== undefined) && question.questionIndex + 1}</p>
                </div>

                {/* Answer Status */}
                {isExamMode && question.answered && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-green-600">Đã trả lời</span>
                    </div>
                )}
                {!isExamMode && question.answered && (
                    <span
                        className={`text-sm font-bold ${
                            question.isCorrect ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {question.isCorrect ? "Chính xác" : "Không chính xác"}
                    </span>
                )}
            </div>

            {/* Question Content */}
            <div className="mt-2 text-gray-700">
                <p
                    title={question.question}
                    className="text-base line-clamp-1 transition-all duration-300"
                >
                    {question.question}
                </p>
            </div>
        </li>
    );
};

export default QuestionItem;