import React from "react";

interface ActionButtonsProps {
  showExplanation: boolean;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  selectedAnswer: number | number[] | null;
  testEnded: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  showExplanation,
  onCheckAnswer,
  onNextQuestion,
  selectedAnswer,
  testEnded,
}) => {
  return !showExplanation ? (
    <button
      onClick={onCheckAnswer}
      disabled={selectedAnswer === null || testEnded}
      className={`cursor-pointer mt-6 px-4 py-2 rounded-sm transition duration-300 ${
        selectedAnswer === null || testEnded
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
      className="cursor-pointer mt-6 px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 transition duration-300"
    >
      Câu hỏi tiếp theo
    </button>
  );
};

export default ActionButtons;