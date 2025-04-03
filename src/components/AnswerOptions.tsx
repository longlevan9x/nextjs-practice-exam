import React from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Answer } from "@/types/question";

interface AnswerOptionsProps {
  answers: Answer[];
  selectedAnswer: number | null;
  showExplanation: boolean;
  correctAnswer: number | undefined;
  onAnswerSelect: (answerId: number) => void;
  testEnded: boolean;
}

const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  answers,
  selectedAnswer,
  showExplanation,
  correctAnswer,
  onAnswerSelect,
  testEnded,
}) => {
  return (
    <ul className="space-y-4">
      {answers.map((answer) => (
        <li
          key={answer.id}
          className={`p-3 border rounded-sm flex items-center transition-all duration-300 ${
            showExplanation
              ? answer.id === correctAnswer
                ? "bg-green-100 border-green-500"
                : selectedAnswer === answer.id
                ? "bg-red-100 border-red-500"
                : "border-gray-300"
              : "hover:bg-gray-100 border-gray-300"
          }`}
        >
          <input
            type="radio"
            name="answer"
            value={answer.id}
            checked={selectedAnswer === answer.id}
            onChange={() => onAnswerSelect(answer.id)}
            disabled={showExplanation || testEnded}
            className="mr-3 w-6 h-6 cursor-pointer"
          />
          <span className="flex-1">{answer.answer}</span>
          {showExplanation && answer.id === correctAnswer && (
            <CheckCircleIcon className="w-5 h-5 text-green-500 ml-3" />
          )}
          {showExplanation && selectedAnswer === answer.id && answer.id !== correctAnswer && (
            <XCircleIcon className="w-5 h-5 text-red-500 ml-3" />
          )}
        </li>
      ))}
    </ul>
  );
};

export default AnswerOptions;