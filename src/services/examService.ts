import examData from "@/data/exams.json"; // Assuming exam data is stored in this file
import { Exam } from "@/types/exam";

export const getExamById = (examId: string): Exam | null => {
  try {
    // Find the exam data by examId
    const exam = examData.find((exam) => exam.id === parseInt(examId));
    return exam || null; // Return the exam data or null if not found
  } catch (error) {
    console.error("Error fetching exam data:", error);
    return null;
  }
};