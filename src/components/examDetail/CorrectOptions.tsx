import { AnswerExplanation } from "@/types/question";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

interface CorrectOptionsProps {
  answerExplanations: AnswerExplanation[];
}

const CorrectOptions: React.FC<CorrectOptionsProps> = ({ answerExplanations }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setScale(1);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setScale(1);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5));
  };

  return (
    <div className="mb-4">
      <h4 className="text-base font-semibold text-green-600 mb-2">Correct Options:</h4>
      <ul className="text-gray-700 space-y-4">
        {answerExplanations.map((answerExplanation, index) => (
          <li key={index} className="space-y-2">
            {(answerExplanation.answer) &&
              <p className="font-bold whitespace-pre-line" dangerouslySetInnerHTML={{ __html: answerExplanation.answer }} />
            }
            {
              ( answerExplanation.explanation) &&
              <p className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: answerExplanation.explanation }} />
            }

            {
              (answerExplanation.link) &&
              <>
                <span className="mr-1">Via:</span>
                <Link
                  href={answerExplanation.link || ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {answerExplanation.link}
                </Link>
              </>
            }

            {
              (answerExplanation.image) &&
              <div className="mt-2 relative group flex justify-center items-center">
                <Image
                  src={answerExplanation.image}
                  alt="Explanation image"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => answerExplanation.image && handleImageClick(answerExplanation.image)}
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            }
          </li>
        ))}
      </ul>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                className="bg-gray-800 text-white hover:bg-gray-700 rounded-full p-2 z-10 transition-colors duration-200 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                className="bg-gray-800 text-white hover:bg-gray-700 rounded-full p-2 z-10 transition-colors duration-200 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                className="bg-gray-800 text-white hover:bg-gray-700 rounded-full p-2 z-10 transition-colors duration-200 cursor-pointer"
                onClick={handleCloseModal}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div
              className="relative max-w-full max-h-full transition-transform duration-200 ease-in-out"
              style={{ transform: `scale(${scale})` }}
            >
              <Image
                src={selectedImage}
                alt="Zoomed explanation image"
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrectOptions;