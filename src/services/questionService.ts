import examQuestions from "@/data/examQuestions.json";
import { Question } from "@/types/question";

// Function to fetch questions based on examId
export const fetchQuestionsByExamId = async (examId: number): Promise<Question[]> => {
  const questionFile = examQuestions.find((exam) => exam.examId === examId)?.questionFile;

  if (!questionFile) {
    // Return an empty array or throw an error if the examId is not found
    console.error(`Exam ID "${examId}" not found.`);
    return [];
  }

  try {
    // Dynamically import the question data from the corresponding file
    const questions: { default: Question[] } = await import(`@/data/questions/${questionFile}`);
    return questions.default;
  } catch (error) {
    console.error(`Failed to load questions for exam ID "${examId}":`, error);
    return [];
  }
};