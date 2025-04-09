import { ExamType } from "@/constants/exam";

export interface Question {
    id: number;
    question: string;
    selectedAnswer?: number | number[] | null;
    corrects: number[];
    isCorrect: boolean;
    domain: string;
}

export interface ExamResult {
    examType: ExamType;
    examId: string;
    resultId?: string;
    startTime: string;
    endTime?: string;
    questions: Question[];
    isCompleted?: boolean;
}
