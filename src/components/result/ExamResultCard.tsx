import React, { useState } from "react";
import { ExamResult } from "@/types/ExamResult";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import CollapsedContent from "./CollapsedContent";
import ExpandedContent from "./ExpandedContent";

interface ExamResultCardProps {
    result: ExamResult;
    attemptNumber: number;
    passPercentage: number;
    isExpanded: boolean;
}

const ExamResultCard: React.FC<ExamResultCardProps> = ({
    result,
    attemptNumber,
    passPercentage,
    isExpanded,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(isExpanded); // State to toggle collapse

    const totalQuestions = result.questions.length;
    const correctAnswers = result.questions.filter((q) => q.isCorrect).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const skippedAnswers = result.questions.filter((q) => q.selectedAnswer === null).length;
    const correctPercentage = Math.round((correctAnswers / totalQuestions) * 100);
    const isPassed = correctPercentage >= passPercentage;

    const startTime = new Date(result.startTime);
    const endTime = new Date(result.endTime);
    const totalTime = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

    const chartData = [
        { name: "Chính xác", value: correctAnswers, color: "#22c55e" }, // Green
        { name: "Không chính xác", value: incorrectAnswers, color: "#ef4444" }, // Red
        { name: "Đã bỏ qua/Chưa có đáp án", value: skippedAnswers, color: "#9ca3af" }, // Gray
    ];

    const topics = result.topics || [
        {
            name: "Math",
            totalQuestions: 10,
            correct: 8,
            incorrect: 2,
            skipped: 0,
        },
        {
            name: "Science",
            totalQuestions: 7,
            correct: 5,
            incorrect: 1,
            skipped: 1,
        },
        {
            name: "History",
            totalQuestions: 5,
            correct: 3,
            incorrect: 2,
            skipped: 0,
        },
    ];

    return (
        <div className="border border-blue-300 px-6 py-2 space-y-4 relative">
            {/* Collapse Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute top-10 right-2 text-sm text-blue-500 hover:underline flex items-center hover:text-blue-700 cursor-pointer hover:bg-blue-100 p-1 rounded"
            >
                {isCollapsed ? (
                    <ChevronDownIcon className="w-5 h-5 text-blue-500 hover:text-blue-700" /> // Icon for "Expand"
                ) : (
                    <ChevronUpIcon className="w-5 h-5 text-blue-500 hover:text-blue-700" /> // Icon for "Collapse"
                )}
            </button>

            {/* Collapsed Content */}
            {isCollapsed && (
                <CollapsedContent
                    chartData={chartData}
                    isPassed={isPassed}
                    correctPercentage={correctPercentage}
                    totalTime={totalTime}
                    startTime={startTime}
                />
            )}

            {/* Expanded Content */}
            {!isCollapsed && (
                <ExpandedContent
                    chartData={chartData}
                    attemptNumber={attemptNumber}
                    isPassed={isPassed}
                    passPercentage={passPercentage}
                    correctPercentage={correctPercentage}
                    correctAnswers={correctAnswers}
                    totalQuestions={totalQuestions}
                    totalTime={totalTime}
                    startTime={startTime}
                    topics={topics}
                    resultId={result.resultId}
                />
            )}
        </div>
    );
};

export default ExamResultCard;