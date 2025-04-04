import React from "react";

interface CorrectOptionsProps {
  answer: string;
  explanation: string;
}

const CorrectOptions: React.FC<CorrectOptionsProps> = ({ answer, explanation }) => {
  return (
    <div className="mb-4">
      <h4 className="text-base font-semibold text-green-600 mb-2">Correct Options:</h4>
      <div className="whitespace-pre-line space-y-2">
        <p className="font-bold">{answer}</p>
        <p>{explanation}</p>
      </div>
    </div>
  );
};

export default CorrectOptions;