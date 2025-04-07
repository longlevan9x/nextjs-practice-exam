export interface ExamResult {
  id: string;
  user_id: string;
  exam_id: string;
  exam_type: string;
  start_time: string;
  end_time: string;
  questions: {
    id: number;
    selected_answer: number | null;
    is_correct: boolean;
  }[];
  created_at: string;
  updated_at: string;
} 