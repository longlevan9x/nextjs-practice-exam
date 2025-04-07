import React from "react";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { BookmarkIcon as BookmarkOutlineIcon} from "@heroicons/react/24/outline";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  size?: string; // Tailwind size classes (e.g., "w-5 h-5")
  className?: string; // Additional custom styles
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onToggle,
  size = "w-6 h-6", // Default size
  className = "", // Default to no additional styles
}) => {
  return (
    <>
      {isBookmarked ? (
        <BookmarkSolidIcon title="Đã đánh dấu" className={`${size} cursor-pointer text-orange-500 ${className}`} onClick={(e) => {
          e.stopPropagation(); // Prevent triggering parent click events
          onToggle();
        }}/>
      ) : (
        <BookmarkOutlineIcon title="Đánh dấu" className={`${size} cursor-pointer text-gray-500 ${className}`} onClick={(e) => {
          e.stopPropagation(); // Prevent triggering parent click events
          onToggle();
        }}/>
      )}
    </>
  );
};

export default BookmarkButton;