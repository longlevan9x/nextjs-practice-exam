import { ExamResult } from './ExamResult';
import { Exam } from './exam';

export interface StatisticsComponentProps {
  examResults: ExamResult[];
  exams: Exam[];
}