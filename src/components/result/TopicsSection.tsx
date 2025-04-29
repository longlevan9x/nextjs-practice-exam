import { ExamDomain } from "@/types/exam";
import React from "react";

interface TopicsSectionProps {
  topics: ExamDomain[];
}

interface HorizontalBarProps {
  questionCount: number;
  totalQuestionCount: number;
  className: string;
  label: string;
}

const HorizontalBar: React.FC<HorizontalBarProps> = ({ label, questionCount, totalQuestionCount, className }) => {
  return (
    <>
      <div className="group relative" style={{ width: `${((questionCount ?? 0) / totalQuestionCount) * 100}%` }}>
        <div className={`h-4 ${className}`} >
          {questionCount > 0 && (
            <div className="text-white text-xs flex items-center justify-center">{questionCount ?? 0}</div>
          )}
        </div>

        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
          {label}: {questionCount ?? 0} câu
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      </div>
    </>
  );
};

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
            <HorizontalBar label="Chính xác" questionCount={topic.correct ?? 0} totalQuestionCount={topic.questionCount} className="bg-green-500" />
            <HorizontalBar label="Không chính xác" questionCount={topic.incorrect ?? 0} totalQuestionCount={topic.questionCount} className="bg-red-500" />
            <HorizontalBar label="Đã bỏ qua/Chưa có đáp án" questionCount={topic.skipped ?? 0} totalQuestionCount={topic.questionCount} className="bg-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopicsSection;