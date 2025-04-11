import { AnswerExplanation } from "@/types/question";
import React from "react";

interface CorrectOptionsProps {
  answerExplanations: AnswerExplanation[];
}

const CorrectOptions: React.FC<CorrectOptionsProps> = ({ answerExplanations }) => {
  return (
    <div className="mb-4">
      <h4 className="text-base font-semibold text-green-600 mb-2">Correct Options:</h4>
      <ul className="text-gray-700 space-y-4">
        {answerExplanations.map((answerExplanation, index) => (
          <li key={index} className="space-y-2">
            <p className="font-bold">{answerExplanation.answer}</p>
            <p>{answerExplanation.explanation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CorrectOptions;