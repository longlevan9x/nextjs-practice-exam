
export interface Question {
    id: number;
    question: string;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    domain: string;
}

export interface ExamResult {
    examId: string;
    resultId: string;
    startTime: string;
    endTime: string;
    questions: Question[];
}
