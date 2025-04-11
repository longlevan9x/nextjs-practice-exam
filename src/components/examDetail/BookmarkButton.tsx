import React from "react";
import { BookmarkIcon } from "@heroicons/react/24/solid";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ isBookmarked, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`rounded-full transition-all duration-200 ${
        isBookmarked 
          ? "text-yellow-500 hover:bg-yellow-50 hover:text-yellow-600" 
          : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"
      }`}
    >
      <BookmarkIcon className="w-5 h-5" />
    </button>
  );
};

export default BookmarkButton;