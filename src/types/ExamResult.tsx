export interface Question {
    id: number;
    question: string;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
}

export interface ExamResult {
    examId: string;
    startTime: string;
    endTime: string;
    questions: Question[];
}