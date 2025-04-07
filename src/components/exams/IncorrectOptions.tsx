import React from "react";

interface IncorrectOption {
  answer: string;
  explanation: string;
}

interface IncorrectOptionsProps {
  incorrectAnswerExplanations: IncorrectOption[];
}

const IncorrectOptions: React.FC<IncorrectOptionsProps> = ({ incorrectAnswerExplanations }) => {
  return (
    <div className="mb-4">
      <h4 className="text-base font-semibold text-red-600 mb-2">Incorrect Options:</h4>
      <ul className="text-gray-700 space-y-4">
        {incorrectAnswerExplanations.map((incorrect, index) => (
          <li key={index} className="space-y-2">
            <p className="font-bold">{incorrect.answer}</p>
            <p>{incorrect.explanation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncorrectOptions;