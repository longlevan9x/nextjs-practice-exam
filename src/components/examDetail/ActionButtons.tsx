import React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { EXAM_TYPES, ExamType } from "@/constants/exam";
import LoadingIcon from "@/components/common/LoadingIcon";

interface ActionButtonsProps {
  showExplanation: boolean;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onSkipQuestion: () => void;
  onSubmitExam: () => void;
  selectedAnswer: number | number[] | null;
  testEnded: boolean;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  examType?: ExamType;
  isFinishing?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  showExplanation,
  onCheckAnswer,
  onNextQuestion,
  onPreviousQuestion,
  onSkipQuestion,
  onSubmitExam,
  selectedAnswer,
  testEnded,
  isFirstQuestion,
  isLastQuestion,
  examType,
  isFinishing,
}) => {
  return (
    <div className="flex justify-end ">
      <div className="flex space-x-4">
        {!isFirstQuestion && (
          <button
            onClick={onPreviousQuestion}
            disabled={testEnded}
            className="cursor-pointer px-2 py-1 lg:px-4 lg:py-2 bg-gray-200 text-gray-700 rounded-xs hover:bg-gray-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
          >
            Quay lại
          </button>
        )}
        {(!selectedAnswer && !showExplanation && !isLastQuestion) && (
          <button
            onClick={onSkipQuestion}
            disabled={testEnded}
            className="flex items-center cursor-pointer px-2 py-1 lg:px-4 lg:py-2 border border-blue-700 rounded-xs hover:bg-gray-200 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-100"
          >
            Bỏ qua câu hỏi
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </button>
        )}

        {selectedAnswer && !showExplanation && examType === EXAM_TYPES.PRACTICE && (
          <button
            onClick={onCheckAnswer}
            disabled={testEnded}
            className="flex items-center cursor-pointer px-2 py-1 lg:px-4 lg:py-2 bg-blue-600 text-white rounded-xs hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            Kiểm tra đáp án
            <ChevronRightIcon className="w-4 h-4 inline-block ml-2" />
          </button>
        )}

        {(showExplanation || (selectedAnswer && examType === EXAM_TYPES.EXAM)) && !isLastQuestion && (
          <button
            onClick={onNextQuestion}
            disabled={testEnded}
            className="flex items-center cursor-pointer px-2 py-1 lg:px-4 lg:py-2 bg-green-600 text-white rounded-xs hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
          >
            Câu hỏi tiếp theo
            <ChevronRightIcon className="w-4 h-4 inline-block ml-2" />
          </button>
        )}

        {
          (isLastQuestion && ((examType === EXAM_TYPES.EXAM) || (examType === EXAM_TYPES.PRACTICE && showExplanation))) && (
            <button
              onClick={onSubmitExam}
              disabled={testEnded}
              className="flex items-center cursor-pointer px-2 py-0 lg:px-4 lg:py-1 border-2 border-blue-600 bg-white rounded-xs hover:bg-blue-700 hover:text-white transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            >
              <span>Kết thúc bài kiểm tra</span>
              {isFinishing && <LoadingIcon />}
            </button>
          )
        }
      </div>
    </div>
  );
};

export default ActionButtons;