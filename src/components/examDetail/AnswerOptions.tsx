import React from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Answer } from "@/types/question";

interface AnswerOptionsProps {
  answers: Answer[];
  selectedAnswer: number | number[] | null;
  showExplanation: boolean;
  onAnswerSelect: (answerId: number) => void;
  multiple: boolean;
  questionId: number;
}

const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  answers,
  selectedAnswer,
  showExplanation,
  onAnswerSelect,
  multiple,
  questionId,
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
            className={`p-3 border cursor-pointer  rounded-sm flex items-center transition-all duration-300 ${showExplanation
                ? isCorrect
                  ? "bg-green-100 border-green-500 dark:bg-green-950"
                  : isIncorrect
                    ? "bg-red-100 border-red-500 dark:bg-red-950"
                    : "border-gray-300 dark:border-gray-600"
                : isSelected
                  ? "bg-blue-50 border-blue-500 dark:bg-slate-900"
                  : "hover:bg-gray-100 border-gray-500 dark:border-gray-600 dark:hover:bg-slate-800"
              }`}
            onClick={() => onAnswerSelect(answer.id)}
          >
            <div className="flex items-center w-6 h-6 mr-3">
              <input
                type={multiple ? "checkbox" : "radio"}
                name={`answer-${questionId}`}
                value={answer.id}
                checked={isSelected}
                onChange={() => onAnswerSelect(answer.id)}
                className={`w-6 h-6 cursor-pointer ${multiple ? "rounded" : ""}`}
              />
            </div>

            <span className="font-bold w-11/12 [&_pre]:bg-gray-100 dark:[&_pre]:bg-gray-700 [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:my-2 [&_pre]:font-mono [&_pre]:text-sm [&_code]:bg-gray-100 dark:[&_code]:bg-gray-700 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_strong]:font-bold" dangerouslySetInnerHTML={{ __html: answer.answer }} />
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