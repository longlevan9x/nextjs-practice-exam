import React from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Answer } from "@/types/question";

interface AnswerOptionsProps {
  answers: Answer[];
  selectedAnswer: number | number[] | null;
  showExplanation: boolean;
  correctAnswer: number | undefined;
  onAnswerSelect: (answerId: number) => void;
  multiple: boolean;
}

const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  answers,
  selectedAnswer,
  showExplanation,
  correctAnswer,
  onAnswerSelect,
  multiple,
}) => {
  return (
    <ul className="space-y-4">
      {answers.map((answer) => {
        const isSelected = multiple
          ? selectedAnswer !== null && Array.isArray(selectedAnswer) && selectedAnswer.includes(answer.id)
          : selectedAnswer === answer.id;

        const isCorrect = showExplanation && answer.correct;
        const isIncorrect = showExplanation && isSelected && !answer.correct;

        return (
          <li
            key={answer.id}
            className={`p-3 border rounded-sm flex items-center transition-all duration-300 ${
              showExplanation
                ? isCorrect
                  ? "bg-green-100 border-green-500"
                  : isIncorrect
                    ? "bg-red-100 border-red-500"
                    : "border-gray-300"
                : isSelected
                  ? "bg-blue-50 border-blue-500"
                  : "hover:bg-gray-100 border-gray-500"
            }`}
          >
            <div className="flex items-center w-6 h-6 mr-3">
              <input
                type={multiple ? "checkbox" : "radio"}
                name="answer"
                value={answer.id}
                checked={isSelected}
                onChange={() => onAnswerSelect(answer.id)}
                className={`w-6 h-6 cursor-pointer ${multiple ? "rounded" : ""}`}
              />
            </div>

            <span className="cursor-pointer font-bold w-11/12" onClick={() => onAnswerSelect(answer.id)}>
              {answer.answer}
            </span>
            <div>
              {isCorrect && <CheckCircleIcon className="w-7 h-7 text-green-500 ml-3" />}
              {isIncorrect && <XCircleIcon className="w-7 h-7 text-red-500 ml-3" />}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default AnswerOptions;