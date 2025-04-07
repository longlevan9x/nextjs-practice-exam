import { ExamDomain } from "@/types/exam";
import React from "react";

interface TopicsSectionProps {
  topics: ExamDomain[];
}

const TopicsSection: React.FC<TopicsSectionProps> = ({ topics }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Lĩnh vực</h3>
      {topics.map((topic, index) => (
        <div key={index} className="space-y-2">
          {/* Topic Name */}
          <p className="text-sm font-semibold text-gray-700">
            {topic.name} ({topic.questionCount} câu hỏi)
          </p>

          {/* Horizontal Bar */}
          <div className="w-full flex h-4">
            <div
              className="bg-green-500 h-4"
              style={{
                width: `${((topic.correct ?? 0) / topic.questionCount) * 100}%`,
              }}
            ></div>
            <div
              className="bg-red-500 h-4"
              style={{
                width: `${((topic.incorrect ?? 0) / topic.questionCount) * 100}%`,
              }}
            ></div>
            <div
              className="bg-gray-400 h-4"
              style={{
                width: `${((topic.skipped ?? 0) / topic.questionCount) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopicsSection;