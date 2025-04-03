import examQuestions from "@/data/examQuestions.json";
import { Question } from "@/types/question";

interface ExamMapping {
  [examId: string]: string; // Maps examId to the corresponding question file
}

// Mapping of examId to question file names
const examMappings: ExamMapping = {
  aws_saa_2023_1: "aws_saa_2023_1.json",
  aws_cda_2023_1: "aws_cda_2023_1.json",
  // Add more mappings as needed
};

// Function to fetch questions based on examId
export const fetchQuestionsByExamId = async (examId: string): Promise<Question[]> => {
  const questionFile = examQuestions.find((exam) => exam.examId === parseInt(examId))?.questionFile;

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