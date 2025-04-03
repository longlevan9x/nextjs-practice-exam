import React from "react";
import { BookmarkIcon } from "@heroicons/react/24/solid";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ isBookmarked, onToggle }) => {
  return (
    <BookmarkIcon
      className={`w-6 h-6 cursor-pointer ${isBookmarked ? "text-blue-500" : "text-gray-500"}`}
      onClick={onToggle}
    />
  );
};

export default BookmarkButton;