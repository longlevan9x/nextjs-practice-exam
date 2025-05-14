import { ExamResult } from '@/types/ExamResult';
import { Exam } from '@/types/exam';
import { Question } from '@/types/question';

export interface StatisticsComponentProps {
  examResults: ExamResult[];
  exams: Exam[];
}


export interface QuestionStatistic {
  question: Question;
  incorrectCount: number;
  totalAttempts: number;
  incorrectPercentage: number;
}