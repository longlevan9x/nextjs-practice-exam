import examData from "@/data/exams.json"; // Assuming exam data is stored in this file
import { Exam } from "@/types/exam";

export const getExamById = (examId: string): Exam | null => {
  try {
    // Find the exam data by examId
    const exam = examData.find((exam) => exam.id === parseInt(examId));
    return exam || null;
  } catch (error) {
    console.error("Error fetching exam data:", error);
    return null;
  }
};

export const getAllExams = (): Exam[] => {
  try {
    return examData;
  } catch (error) {
    console.error("Error fetching exam data:", error);
    return [];
  }
};

