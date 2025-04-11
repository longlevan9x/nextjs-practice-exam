import { ExamType } from "@/constants/exam";

export interface ExamCardProps {
  id: number;
  logo: string;
  title: string;
  description: string;
  incomplete?: boolean;
  examType?: ExamType;
}