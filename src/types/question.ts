export interface Answer {
  id: number;
  answer: string;
  correct: boolean;
}

export interface IncorrectAnswerExplanation {
  answer: string;
  explanation: string;
}

export interface Question {
  id: number;
  question: string;
  corrects: number[]; // IDs of the correct answers
  answers: Answer[]; // List of all possible answers
  explanation: string; // Detailed explanation for the correct answers
  correctAnswerExplanation?: {
    answer: string;
    explanation: string;
  }; // Optional detailed explanation for correct answers
  incorrectAnswerExplanations?: IncorrectAnswerExplanation[]; // Optional explanations for incorrect answers
  references?: string[]; // Optional list of reference links
  multiple?: boolean; // Indicates if multiple answers are correct
  domain?: string; // Domain or category of the question
  selectedAnswer?: number | number[] | null; // User's selected answer(s)
  showExplanation?: boolean; // Whether to show the explanation
  answered?: boolean; // Whether the question has been answered
  correct?: boolean; // Whether the user's answer is correct
}