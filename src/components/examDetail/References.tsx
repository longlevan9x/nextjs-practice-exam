import React from "react";

interface ReferencesProps {
  references: string[];
}

const References: React.FC<ReferencesProps> = ({ references }) => {
  return (
    <div>
      <h4 className="text-base font-semibold text-blue-600">References:</h4>
      <ul className="list-disc list-inside text-blue-600">
        {references.map((reference, index) => (
          <li key={index}>
            <a
              href={reference}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline break-all whitespace-pre-wrap"
            >
              {reference}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default References;