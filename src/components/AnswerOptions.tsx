import React from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Answer } from "@/types/question";

interface AnswerOptionsProps {
  answers: Answer[];
  selectedAnswer: number | null;
  showExplanation: boolean;
  correctAnswer: number | undefined;
  onAnswerSelect: (answerId: number) => void;
}

const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  answers,
  selectedAnswer,
  showExplanation,
  correctAnswer,
  onAnswerSelect,
}) => {
  return (
    <ul className="space-y-4">
      {answers.map((answer) => (
        <li
          key={answer.id}
          className={`p-3 border rounded-sm flex items-center transition-all duration-300 ${showExplanation
            ? answer.id === correctAnswer
              ? "bg-green-100 border-green-500"
              : selectedAnswer === answer.id
                ? "bg-red-100 border-red-500"
                : "border-gray-300"
            : "hover:bg-gray-100 border-gray-300"
            }`}
        >
          <div className="fex items-center w-6 h-6 mr-3 ">
            <input
              type="radio"
              name="answer"
              value={answer.id}
              checked={selectedAnswer === answer.id}
              onChange={() => onAnswerSelect(answer.id)}
              className="w-6 h-6 cursor-pointer"
            />
          </div>

          <span className=" cursor-pointer w-full" onClick={() => onAnswerSelect(answer.id)}>{answer.answer}</span>
          <div>
            {showExplanation && answer.id === correctAnswer && (
              <CheckCircleIcon className="w-7 h-7 text-green-500 ml-3" />
            )}
            {showExplanation && selectedAnswer === answer.id && answer.id !== correctAnswer && (
              <XCircleIcon className="w-7 h-7 text-red-500 ml-3" />
            )}
          </div>

        </li>
      ))}
    </ul>
  );
};

export default AnswerOptions;