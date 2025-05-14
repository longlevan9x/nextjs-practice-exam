import { ExamResult } from '@/types/ExamResult';
import { Question } from '@/types/question';
import { QuestionStatistic } from '@/types/statistics';

export const calculateMostIncorrectQuestions = (
  examResults: ExamResult[],
  questions: Question[]
): QuestionStatistic[] => {
  // Tạo map để lưu thống kê cho từng câu hỏi
  const questionStats = new Map<number, { incorrectCount: number; totalAttempts: number }>();

  // Duyệt qua từng kết quả bài thi
  examResults.forEach((result) => {
    const questionResults = result.questions;

    questionResults.forEach((questionResult) => {
      const questionId = questionResult.id;
      const currentStats = questionStats.get(questionId) || { incorrectCount: 0, totalAttempts: 0 };

      // Tăng số lần thử
      currentStats.totalAttempts += 1;
      
      // Nếu câu trả lời sai, tăng số lần sai
      if (!questionResult.isCorrect && questionResult.selectedAnswer !== null) {
        currentStats.incorrectCount += 1;
      }

      questionStats.set(questionId, currentStats);
    });
  });

  // Chuyển đổi map thành mảng và tính toán tỷ lệ sai
  const statistics: QuestionStatistic[] = Array.from(questionStats.entries())
    .map(([questionId, stats]) => {
      const question = questions.find(q => q.id === questionId);
      if (!question) return null;

      return {
        question,
        incorrectCount: stats.incorrectCount,
        totalAttempts: stats.totalAttempts,
        incorrectPercentage: (stats.incorrectCount / stats.totalAttempts) * 100
      };
    })
    .filter((stat): stat is QuestionStatistic => stat !== null)
    .sort((a, b) => {
      // Sắp xếp theo số lần sai giảm dần
      if (b.incorrectCount !== a.incorrectCount) {
        return b.incorrectCount - a.incorrectCount;
      }
      // Nếu số lần sai bằng nhau, sắp xếp theo tỷ lệ sai giảm dần
      return b.incorrectPercentage - a.incorrectPercentage;
    }).filter((stat) => stat.incorrectCount > 0);

  return statistics;
}; 