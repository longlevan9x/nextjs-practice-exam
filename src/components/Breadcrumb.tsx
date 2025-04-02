'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Exam } from "@/types/exam";

const Breadcrumb: React.FC = () => {
  const pathname = usePathname(); // Get the current route
  const pathSegments = pathname.split("/").filter((segment) => segment); // Split and filter empty segments
  const [examName, setExamName] = useState<string | null>(null);

  useEffect(() => {
    // Check if the current route is an exam detail page
    const fetchExamName = async () => {
      if (pathSegments[0] === "exams" && pathSegments[1]) {
        try {
          const response = await import("@/data/exams.json");
          const examData = response.default.find(
            (exam: Exam) => exam.id === parseInt(pathSegments[1])
          );
          if (examData) {
            setExamName(examData.name); // Set the exam name
          }
        } catch (err) {
          console.error("Failed to fetch exam data:", err);
        }
      }
    };

    fetchExamName();
  }, [pathSegments]);

  return (
    <nav className="text-sm text-gray-600">
      <ul className="flex items-center space-x-2">
        {/* Home Link */}
        <li>
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
        </li>

        {/* Separator */}
        {pathSegments.length > 0 && <li>/</li>}

        {/* Dynamic Breadcrumb Items */}
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;

          // Replace the exam ID with the exam name if on the exam detail page
          const displayName =
            pathSegments[0] === "exams" && index === 1 && examName
              ? examName
              : decodeURIComponent(segment);

          return (
            <React.Fragment key={index}>
              <li>
                {isLast ? (
                  <span className="text-gray-500">{displayName}</span>
                ) : (
                  <Link href={href} className="text-blue-600 hover:underline">
                    {displayName}
                  </Link>
                )}
              </li>
              {!isLast && <li>/</li>}
            </React.Fragment>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;