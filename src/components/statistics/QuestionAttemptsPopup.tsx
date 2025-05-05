import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ExamResult } from '@/types/ExamResult';
import { Question } from '@/types/question';
import AnswerExplanation from '@/components/examDetail/AnswerExplanation';
import References from '@/components/examDetail/References';
import { EXPLANATION_SECTION_TITLE } from '@/constants/constants';

interface QuestionAttemptsPopupProps {
  question: Question;
  examResults: ExamResult[];
  onClose: () => void;
}

const QuestionAttemptsPopup: React.FC<QuestionAttemptsPopupProps> = ({
  question,
  examResults,
  onClose,
}) => {
  // Lọc các lần làm bài có câu hỏi này
  const attempts = examResults
    .filter(result => 
      result.questions.some(q => q.id === question.id && q.selectedAnswer !== null)
    )
    .map(result => {
      const questionResult = result.questions.find(q => q.id === question.id);
      return {
        date: new Date(result.endTime || ''),
        selectedAnswer: questionResult?.selectedAnswer,
        isCorrect: questionResult?.isCorrect,
        examId: result.examId,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className=" bg-black opacity-90 absolute w-full h-full z-10"></div>

      <div className="bg-white rounded-xs p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto z-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Chi tiết các lần trả lời
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer hover:bg-gray-100 p-1"
            title="Đóng"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-800" dangerouslySetInnerHTML={{ __html: question.question }} />
        </div>

        <div className="space-y-3">
          {attempts.map((attempt, index) => (
            <div
              key={index}
              className={`border rounded-lg p-3 ${
                attempt.isCorrect ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium">
                    {attempt.date.toLocaleDateString('vi-VN')}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {attempt.date.toLocaleTimeString('vi-VN')}
                  </span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    attempt.isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {attempt.isCorrect ? 'Đúng' : 'Sai'}
                </span>
              </div>
              {!attempt.isCorrect && attempt.selectedAnswer !== null && (
                <div className="mt-2">
                  <span className="text-sm text-gray-600">Đáp án đã chọn: </span>
                  <span className="text-sm font-medium text-red-600">
                    {question.answers.find(a => a.id === attempt.selectedAnswer)?.answer}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`mt-6 p-4 bg-gray-50 border border-gray-300 rounded-xs transition-all duration-300 delay-100`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{EXPLANATION_SECTION_TITLE}</h3>

            {question.correctAnswerExplanations && (
              <AnswerExplanation
                answerExplanations={question.correctAnswerExplanations}
                type="correct"
              />
            )}

            {question.incorrectAnswerExplanations && question.incorrectAnswerExplanations.length > 0 && (
              <AnswerExplanation
                answerExplanations={question.incorrectAnswerExplanations}
                type="incorrect"
              />
            )}

            {question.references && question.references.length > 0 && (
              <References references={question.references} />
            )}
          </div>
      </div>
    </div>
  );
};

export default QuestionAttemptsPopup; 