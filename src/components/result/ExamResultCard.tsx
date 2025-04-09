import React, { useState } from "react";
import { ExamResult } from "@/types/ExamResult";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import CollapsedContent from "./CollapsedContent";
import ExpandedContent from "./ExpandedContent";
import { ExamDomain } from "@/types/exam";

interface ExamResultCardProps {
    result: ExamResult;
    attemptNumber: number;
    passPercentage: number;
    isExpanded: boolean;
    domains: ExamDomain[]; // Added property for domains
}

const ExamResultCard: React.FC<ExamResultCardProps> = ({
    result,
    attemptNumber,
    passPercentage,
    isExpanded,
    domains,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(isExpanded); // State to toggle collapse
    const totalQuestions = result.questions.length;
    const correctAnswers = result.questions.filter((q) => q.isCorrect).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const skippedAnswers = result.questions.filter((q) => q.selectedAnswer === null).length;
    const correctPercentage = Math.round((correctAnswers / totalQuestions) * 100);
    const isPassed = correctPercentage >= passPercentage;

    const startTime = new Date(result.startTime);
    const endTime = result.endTime ? new Date(result.endTime) : undefined;
    const totalTime = endTime ? Math.round((endTime.getTime() - startTime.getTime()) / 60000) : undefined;

    const chartData = [
        { name: "Chính xác", value: correctAnswers, color: "#22c55e" }, // Green
        { name: "Không chính xác", value: incorrectAnswers, color: "#ef4444" }, // Red
        { name: "Đã bỏ qua/Chưa có đáp án", value: skippedAnswers, color: "#9ca3af" }, // Gray
    ];

    // Map questions to domains
    const domainStats = domains.map((domain) => {
        const domainQuestions = result.questions.filter((q) => q.domain === domain.name);
        const correct = domainQuestions.filter((q) => q.isCorrect).length;
        const incorrect = domainQuestions.filter((q) => !q.isCorrect && q.selectedAnswer !== null).length;
        const skipped = domainQuestions.filter((q) => q.selectedAnswer === null).length;

        return {
            ...domain,
            totalQuestions: domainQuestions.length,
            correct,
            incorrect,
            skipped,
        };
    });

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
                    domains={domainStats} // Pass updated domains with stats
                    resultId={result.resultId}
                />
            )}
        </div>
    );
};

export default ExamResultCard;