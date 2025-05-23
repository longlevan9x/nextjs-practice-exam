export interface Answer {
  id: number;
  answer: string;
  correct: boolean;
}

export interface AnswerExplanation {
  answer: string;
  explanation: string;
  link?: string;
  image?: string;
}


export interface Question {
  id: number;
  question: string;
  corrects: number[]; // IDs of the correct answers
  answers: Answer[]; // List of all possible answers
  explanation: string; // Detailed explanation for the correct answers
  correctAnswerExplanations: AnswerExplanation[];
  incorrectAnswerExplanations?: AnswerExplanation[]; // Optional explanations for incorrect answers
  references?: string[]; // Optional list of reference links
  multiple?: boolean; // Indicates if multiple answers are correct
  domain?: string; // Domain or category of the question

  // Properties for exam practice
  selectedAnswer?: number | number[] | null; // User's selected answer(s)
  showExplanation?: boolean; // Whether to show the explanation
  answered?: boolean; // Whether the question has been answered
  isCorrect?: boolean; // Whether the question is correct
  isBookmarked?: boolean; // Added property
  incorrect?: boolean;
  questionIndex?: number;
}