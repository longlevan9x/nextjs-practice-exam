import { ExamResult } from "@/types/ExamResult";

export const createExamResult = (examId: string, data: object) => {
    try {
        const uniqueId = crypto.randomUUID(); // Generate a unique ID
        const timestamp = new Date().toISOString();
        const resultWithMetadata = { ...data, timestamp, examId, resultId: uniqueId };
        localStorage.setItem(`examResults-${examId}-${uniqueId}`, JSON.stringify(resultWithMetadata));
    } catch (error) {
        console.error("Error saving exam result to localStorage:", error);
    }
};

export const saveExamResultByResultId = (examId: number, resultId: string, data: object) => {
    try {
        localStorage.setItem(`examResults-${examId}-${resultId}`, JSON.stringify(data));
    } catch (error) {
        console.error("Error saving exam result to localStorage:", error);
    }
};  

export const getAllExamResults = (examId: string): ExamResult[] => {
    try {
        const keys = Object.keys(localStorage).filter((key) =>
            key.startsWith(`examResults-${examId}-`)
        );
        return keys.map((key) => JSON.parse(localStorage.getItem(key) || "{}") as ExamResult);
    } catch (error) {
        console.error("Error fetching all exam results:", error);
        return [];
    }
};

export const getExamResultById = (resultId: string): ExamResult | null => {
    try {
        const result = localStorage.getItem(`examResults-${resultId}`);
        return result ? JSON.parse(result) as ExamResult : null;
    } catch (error) {
        console.error("Error retrieving exam result by ID from localStorage:", error);
        return null;
    }
};