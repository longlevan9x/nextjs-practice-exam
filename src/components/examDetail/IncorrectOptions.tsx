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
            { 
              (incorrect.answer) &&
              <p className="font-bold whitespace-pre-line" dangerouslySetInnerHTML={{ __html: incorrect.answer }} />
            }
            {
              (incorrect.explanation) &&
              <p className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: incorrect.explanation }} />
            }
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncorrectOptions;