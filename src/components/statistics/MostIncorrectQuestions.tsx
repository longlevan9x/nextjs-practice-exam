import React, { useState, useEffect } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ExamResult } from '@/types/ExamResult';
import { calculateMostIncorrectQuestions } from '@/services/statisticsService';
import { fetchQuestionsByExamId } from '@/services/questionService';
import { QuestionStatistic } from '@/types/statistics';
import QuestionAttemptsPopup from './QuestionAttemptsPopup';

interface MostIncorrectQuestionsProps {
  examId: number;
  examResults: ExamResult[];
}

const MostIncorrectQuestions: React.FC<MostIncorrectQuestionsProps> = ({ examId, examResults }) => {
  const [statistics, setStatistics] = useState<QuestionStatistic[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionStatistic | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch questions for the exam
      const questions = await fetchQuestionsByExamId(examId);
      // Calculate statistics
      const statistics = calculateMostIncorrectQuestions(examResults, questions);
      setStatistics(statistics);
    };

    fetchData();
  }, [examId, examResults]);

  if (statistics.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Không có câu hỏi sai trong đề thi này.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {statistics.map((stat, index) => (
        <div key={stat.question.id} className="border rounded-lg p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                <span className="text-sm font-medium text-red-600">
                  {stat.incorrectPercentage.toFixed(1)}% sai
                </span>
                <span className="text-sm text-gray-500">
                  ({stat.incorrectCount}/{stat.totalAttempts} lần)
                </span>
              </div>
              <p className="text-gray-800 line-clamp-2" dangerouslySetInnerHTML={{ __html: stat.question.question }} />
            </div>
            <div className="flex gap-2 cursor-pointer hover:text-blue-800 hover:underline">
              <button
                onClick={() => setSelectedQuestion(stat)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
              >
                Xem chi tiết
              </button>
              <Link
                href={`/exam/${examId}/question/${stat.question.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {selectedQuestion && (
        <QuestionAttemptsPopup
          question={selectedQuestion.question}
          examResults={examResults}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
    </div>
  );
};

export default MostIncorrectQuestions; 