export interface Answer {
    id: number;
    answer: string;
    correct: boolean;
}

export interface Question {
    id: number;
    question: string;
    answers: Answer[];
    explanation: string;
    domain: string;
    answered?: boolean;
    correct?: boolean;
    incorrect?: boolean;
    selectedAnswer?: number | null;
    showExplanation?: boolean;
}