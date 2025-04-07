export interface Exam {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  updatedAt: string;
  categories: {
    name: string;
    path: string;
  }[];
  domains?: ExamDomain[]; // Added property
  questionCount: number;
  duration: number;
  passScore: number;  
}

export interface ExamDomain {
  name: string;
  questionCount: number;
  correct?: number;
  incorrect?: number;
  skipped?: number;
}