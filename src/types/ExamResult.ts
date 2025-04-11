import { ExamType } from "@/constants/exam";

export interface ExamResultQuestion {
    id: number;
    selectedAnswer?: number | number[] | null;
    isCorrect: boolean;
    questionIndex: number;
}

export interface ExamResult {
    userId?: string;
    examType: ExamType;
    examId: number;
    resultId?: string;
    startTime?: string;
    endTime?: string;
    questions: ExamResultQuestion[];
    isCompleted?: boolean;
    currentQuestionIndex?: number;
}
