import examData from "@/data/exams.json"; // Assuming exam data is stored in this file
import { Exam } from "@/types/exam";

export const getExamById = (examId: number): Exam | null => {
  try {
    // Find the exam data by examId
    const exam = examData.find((exam) => exam.id === examId);
    return exam as Exam | null;
  } catch (error) {
    console.error("Error fetching exam data:", error);
    return null;
  }
};

export const getAllExams = (): Exam[] => {
  try {
    return examData as Exam[];
  } catch (error) {
    console.error("Error fetching exam data:", error);
    return [];
  }
};

export const getExams = (): Exam[] => {
  return examData as Exam[];
};

export const getExamsByCourseId = (courseId: number): Exam[] => {
  return examData.filter((exam) => exam.courseId === courseId) as Exam[];
};
