'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Exam } from "@/types/exam";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);
  const [examName, setExamName] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchExamName = async () => {
      if (pathSegments[0] === "exams" && pathSegments[1]) {
        try {
          const response = await import("@/data/exams.json");
          const examData = response.default.find(
            (exam: Exam) => exam.id === parseInt(pathSegments[1])
          );
          if (examData) {
            setExamName(examData.name);
          }
        } catch (err) {
          console.error("Failed to fetch exam data:", err);
        }
      }
    };

    fetchExamName();
  }, [pathSegments]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <nav className="text-sm text-gray-600">
      <ul className="flex items-center flex-wrap gap-1">
        {/* Home Link */}
        <li className="flex items-center">
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
        </li>

        {/* Separator */}
        {pathSegments.length > 0 && (
          <li className="flex items-center">
            <span className="mx-1">/</span>
          </li>
        )}

        {/* Dynamic Breadcrumb Items */}
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const displayName =
            pathSegments[0] === "exams" && index === 1 && examName
              ? examName
              : decodeURIComponent(segment);

          const truncatedName = isMobile ? truncateText(displayName, 20) : displayName;

          return (
            <React.Fragment key={index}>
              <li className="flex items-center">
                {isLast ? (
                  <div className="flex items-center">
                    <span className="text-gray-500" title={displayName}>
                      {truncatedName}
                    </span>
                    {isMobile && displayName.length > 20 && (
                      <div className="relative group ml-1">
                        <InformationCircleIcon className="w-4 h-4 text-gray-400" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                          {displayName}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href={href} className="text-blue-600 hover:underline" title={displayName}>
                    {truncatedName}
                  </Link>
                )}
              </li>
              {!isLast && (
                <li className="flex items-center">
                  <span className="mx-1">/</span>
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;