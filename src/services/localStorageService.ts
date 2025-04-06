import { ExamResult } from "@/types/ExamResult";

export const saveTestResults = (examId: string, data: object) => {
  try {
    localStorage.setItem(`examResults-${examId}`, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving test results to localStorage:", error);
  }
};

export const getTestResults = (examId: string) => {
  try {
    const storedData = localStorage.getItem(`examResults-${examId}`);
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error("Error retrieving test results from localStorage:", error);
    return null;
  }
};

export const clearTestResults = (examId: string) => {
  try {
    localStorage.removeItem(`examResults-${examId}`);
  } catch (error) {
    console.error("Error clearing test results from localStorage:", error);
  }
};

export const getExamResult = (examId: string): ExamResult | null => {
  try {
    const storedData = localStorage.getItem(`examResults-${examId}`);
    return storedData ? (JSON.parse(storedData) as ExamResult) : null;
  } catch (error) {
    console.error("Error retrieving exam result from localStorage:", error);
    return null;
  }
};

export const getAllExamResults = (): ExamResult[] => {
  try {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("examResults-")
    );
    return keys.map((key) => JSON.parse(localStorage.getItem(key) || "{}") as ExamResult);
  } catch (error) {
    console.error("Error fetching all exam results:", error);
    return [];
  }
};