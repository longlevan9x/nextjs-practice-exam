import React from "react";
import DonutChartWithLegend from "@/components/charts/DonutChartWithLegend";
import TopicsSection from "./TopicsSection";
import { useRouter } from "next/navigation";
import { ExamDomain } from "@/types/exam";
import HorizontalLegend from "../charts/HorizontalLegend";

interface ExpandedContentProps {
    chartData: { name: string; value: number; color: string }[];
    attemptNumber: number;
    isPassed: boolean;
    passPercentage: number;
    correctPercentage: number;
    correctAnswers: number;
    totalQuestions: number;
    totalTime: number;
    startTime: Date;
    domains: ExamDomain[];
    resultId: string; 
}

const ExpandedContent: React.FC<ExpandedContentProps> = ({
    chartData,
    attemptNumber,
    isPassed,
    passPercentage,
    correctPercentage,
    correctAnswers,
    totalQuestions,
    totalTime,
    startTime,
    domains,
    resultId,
}) => {
    const router = useRouter(); // Initialize Next.js router

    const handleReviewQuestions = () => {
        // Navigate to the result overview page
          router.push(`result/${resultId}`);
    };

    return (
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
                            {Math.floor(totalTime / 60)} giờ {totalTime % 60} phút
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
                            className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                            onClick={handleReviewQuestions}
                        >
                            Xem lại câu hỏi
                        </button>
                    </div>

                </div>
            </div>

            {/* Topics Section */}
            <TopicsSection topics={domains} />
            <HorizontalLegend data={chartData}></HorizontalLegend>
        </>
    );
};

export default ExpandedContent;