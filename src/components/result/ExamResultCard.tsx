import React, { useState } from "react";
import { ExamResult } from "@/types/ExamResult";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import DonutChartWithLegend from "@/components/charts/DonutChartWithLegend";
import DonutChart from "@/components/charts/DonutChart";

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

    const topics = [
        {
            name: "Topic 1",
            totalQuestions: 10,
            correct: 6,
            incorrect: 3,
            skipped: 1,
        },
        {
            name: "Topic 2",
            totalQuestions: 8,
            correct: 4,
            incorrect: 2,
            skipped: 2,
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
                <div className="flex items-center justify-between space-x-4 pr-6">
                    {/* Small Donut Chart */}
                    <div className="w-24 h-24">
                        <DonutChart data={chartData} />
                    </div>

                    {/* Status */}
                    <div className="flex flex-col items-start">
                        <p
                            className={`text-base font-semibold ${isPassed ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {isPassed ? "Thành công" : "Không thành công"}
                        </p>
                    </div>

                    <div className="flex flex-col items-start">
                        <p className="text-base font-bold">
                            Đúng {correctPercentage}%
                        </p>
                    </div>

                    {/* Time and Date */}
                    <div className="flex flex-col items-end text-base text-gray-700">
                        <p>
                            {Math.floor(totalTime / 60)} giờ {totalTime % 60} phút
                        </p>
                    </div>
                    {/* Time and Date */}
                    <div className="flex flex-col items-end text-base text-gray-700">
                        <p>{startTime.toLocaleDateString()}</p>
                    </div>
                </div>
            )}

            {/* Card Content */}
            {!isCollapsed && (
                <>
                    <div className="flex space-x-8 py-4">
                        {/* Left Section: Donut Chart */}
                        <div className="flex flex-col items-center space-y-4 w-1/2">
                            <DonutChartWithLegend data={chartData} />
                        </div>

                        {/* Right Section: Details */}
                        <div className="flex flex-col space-y-3 w-1/2 pr-2">
                            {/* Attempt Header */}
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg">
                                    Lần thử thứ {attemptNumber}:
                                    <span
                                        className={`ml-2 text-lg font-semibold ${isPassed ? "text-green-600" : "text-red-600"
                                            }`}
                                    >
                                        {isPassed
                                            ? "Đạt!"
                                            : `Trượt! (Bắt buộc phải đúng ${passPercentage}% thì mới đạt)`}
                                    </span>
                                </h2>
                            </div>

                            {/* Correct Answer Rate */}
                            <p className="">
                                Đúng:
                                <span className="mx-2 text-6xl">{correctPercentage}%</span>
                                ({correctAnswers}/{totalQuestions})
                            </p>

                            {/* Total Time */}
                            <p className="">
                                <span className="">
                                    {Math.floor(totalTime / 60)}giờ {totalTime % 60}phút
                                </span>
                            </p>

                            {/* Timestamp */}
                            <p className="">
                                lúc {startTime.toLocaleTimeString()} -{" "}
                                {startTime.toLocaleDateString()}
                            </p>

                            <div>
                                {/* Review Questions Button */}
                                <button
                                    onClick={() => console.log("Reviewing questions...")}
                                    className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    Xem lại câu hỏi
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Topics Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Lĩnh vực</h3>
                        {topics.map((topic, index) => (
                            <div key={index} className="space-y-2">
                                {/* Topic Name */}
                                <p className="text-sm font-semibold text-gray-700">
                                    {topic.name} ({topic.totalQuestions} câu hỏi)
                                </p>

                                {/* Horizontal Bar */}
                                <div className="w-full flex h-4">
                                    <div
                                        className="bg-green-500 h-4"
                                        style={{
                                            width: `${(topic.correct / topic.totalQuestions) * 100}%`,
                                        }}
                                    ></div>
                                    <div
                                        className="bg-red-500 h-4"
                                        style={{
                                            width: `${(topic.incorrect / topic.totalQuestions) * 100}%`,
                                        }}
                                    ></div>
                                    <div
                                        className="bg-gray-400 h-4"
                                        style={{
                                            width: `${(topic.skipped / topic.totalQuestions) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}

                        {/* Legend Section */}
                        <div className="flex space-x-4 text-sm">
                            <div className="flex items-center space-x-2">
                                <span className="w-4 h-4 bg-green-500 inline-block"></span>
                                <span>Chính xác</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-4 h-4 bg-red-500 inline-block"></span>
                                <span>Không chính xác</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-4 h-4 bg-gray-400 inline-block"></span>
                                <span>Đã bỏ qua/Chưa có đáp án</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExamResultCard;