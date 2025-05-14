import React from 'react';
import { ExamResult } from '@/types/ExamResult';
import { Exam } from '@/types/exam';

interface StatisticsOverviewProps {
  examResults: ExamResult[];
  exams: Exam[];
}

const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({ examResults, exams }) => {
  // Calculate total completed exams
  const completedExams = examResults.filter(result => result.isCompleted);
  const totalExams = completedExams.length;

  // Calculate pass/fail ratio
  const passedExams = completedExams.filter(result => {
    const exam = exams.find(e => e.id === result.examId);
    return exam && result.passScore && result.passScore >= exam.passScore;
  });
  const passRatio = totalExams > 0 ? (passedExams.length / totalExams) * 100 : 0;

  // Calculate average score
  const averageScore = totalExams > 0 
    ? completedExams.reduce((sum, result) => sum + (result.passScore ?? 0), 0) / totalExams 
    : 0;

  // Calculate average time
  const averageTime = totalExams > 0
    ? completedExams.reduce((sum, result) => {
        const start = new Date(result.startTime ?? '').getTime();
        const end = new Date(result.endTime ?? '').getTime();
        return sum + (end - start);
      }, 0) / totalExams
    : 0;

  // Format time from milliseconds to minutes
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    return `${minutes} phút`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Completed Exams */}
      <div className="bg-blue-50 rounded-lg p-3">
        <h3 className="text-base font-semibold text-blue-800">Số bài thi đã hoàn thành</h3>
        <p className="text-2xl font-bold text-blue-600">{totalExams}</p>
      </div>

      {/* Pass/Fail Ratio */}
      <div className="bg-green-50 rounded-lg p-3">
        <h3 className="text-base font-semibold text-green-800">Tỷ lệ đậu</h3>
        <p className="text-2xl font-bold text-green-600">{passRatio.toFixed(1)}%</p>
      </div>

      {/* Average Score */}
      <div className="bg-purple-50 rounded-lg p-3">
        <h3 className="text-base font-semibold text-purple-800">Điểm trung bình</h3>
        <p className="text-2xl font-bold text-purple-600">{averageScore.toFixed(1)}</p>
      </div>

      {/* Average Time */}
      <div className="bg-orange-50 rounded-lg p-3">
        <h3 className="text-base font-semibold text-orange-800">Thời gian trung bình</h3>
        <p className="text-2xl font-bold text-orange-600">{formatTime(averageTime)}</p>
      </div>
    </div>
  );
};

export default StatisticsOverview; 