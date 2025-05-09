import React, { useState } from "react";
import DonutChartWithLegend from "@/components/charts/DonutChartWithLegend";
import TopicsSection from "./TopicsSection";
import { useRouter } from "next/navigation";
import { ExamDomain } from "@/types/exam";
import HorizontalLegend from "../charts/HorizontalLegend";
import LoadingIcon from "../common/LoadingIcon";
import { EXAM_TYPES } from "@/constants/exam";
interface ExpandedContentProps {
    chartData: { name: string; value: number; color: string }[];
    attemptNumber: number;
    isPassed: boolean;
    passPercentage: number;
    correctPercentage: number;
    correctAnswers: number;
    totalQuestions: number;
    totalTime: number | undefined;
    startTime: Date | undefined;
    domains: ExamDomain[];
    resultId: string | undefined;
    examType: string;
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
    examType,
}) => {
    const router = useRouter();
    const [isReviewing, setIsReviewing] = useState<boolean>(false);

    const handleReviewQuestions = async () => {
        try {
            setIsReviewing(true);
            await router.push(`result/${resultId}`);
        } catch (error) {
            console.error('Error reviewing questions:', error);
            setIsReviewing(false);
        }
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row lg:space-x-8 py-4">
                {/* Left Section: Donut Chart */}
                <div className="flex flex-col items-center space-y-4 w-full lg:w-1/2 mb-6 lg:mb-0">
                    <DonutChartWithLegend data={chartData} />
                </div>

                {/* Right Section: Details */}
                <div className="flex flex-col space-y-3 w-full lg:w-1/2 lg:pr-2">
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

                    <div className="flex items-center">
                        {examType === EXAM_TYPES.PRACTICE && (
                            <p className="text-sm bg-green-600 px-3 rounded-full text-white">Luyện tập</p>
                        )}
                        {examType === EXAM_TYPES.EXAM && (
                            <p className="text-sm bg-blue-600 px-3 rounded-full text-white">Thực hành</p>
                        )}
                    </div>

                    {/* Total Time */}
                    <p className="">
                        <span className="">
                            {totalTime ? `${Math.floor(totalTime / 60)} giờ ${totalTime % 60} phút` : 'Không có thời gian'}
                        </span>
                    </p>

                    {/* Timestamp */}
                    <p className="">
                        lúc {startTime ? startTime.toLocaleTimeString() : ''} -{" "}
                        {startTime ? startTime.toLocaleDateString() : ''}
                    </p>

                    <div>
                        {/* Review Questions Button */}
                        <button
                            className={`px-3 py-1.5 lg:px-4 lg:py-2 bg-blue-500 text-white rounded-xs cursor-pointer flex items-center justify-center text-sm lg:text-base ${isReviewing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                                }`}
                            onClick={handleReviewQuestions}
                            disabled={isReviewing}
                        >
                            <span>Xem lại câu hỏi</span>
                            {isReviewing && <LoadingIcon />}
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