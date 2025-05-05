import { ExamType } from "@/constants/exam";

export interface ExamResultQuestion {
    id: number;
    selectedAnswer?: number | number[] | null;
    isCorrect: boolean;
    questionIndex: number;
    answers: ExamResultQuestionAnswer[];
}
export interface ExamResultQuestionAnswer {
    id: number;
    correct: boolean;
}
export interface ExamResult {
    userId?: string;
    courseId?: number;
    examType: ExamType;
    examId: number;
    resultId?: string;
    startTime?: string;
    endTime?: string;
    questions: ExamResultQuestion[];
    isCompleted?: boolean;
    currentQuestionIndex?: number;

    // Statistics
    passScore?: number;
}
