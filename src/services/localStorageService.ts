import { ExamResult } from "@/types/ExamResult";

export const saveTestResults = (examId: string, data: object) => {
    try {
        const uniqueId = crypto.randomUUID(); // Generate a unique ID
        const timestamp = new Date().toISOString();
        const resultWithMetadata = { ...data, timestamp, examId, resultId: uniqueId };
        localStorage.setItem(`examResults-${uniqueId}`, JSON.stringify(resultWithMetadata));
    } catch (error) {
        console.error("Error saving test results to localStorage:", error);
    }
};

export const getTestResults = (examId: string) => {
    try {
        const keys = Object.keys(localStorage).filter((key) =>
            key.startsWith(`examResults-${examId}-`)
        );
        return keys.map((key) => JSON.parse(localStorage.getItem(key) || "{}"));
    } catch (error) {
        console.error("Error retrieving test results from localStorage:", error);
        return [];
    }
};

export const clearTestResults = (examId: string) => {
    try {
        const keys = Object.keys(localStorage).filter((key) =>
            key.startsWith(`examResults-${examId}-`)
        );
        keys.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
        console.error("Error clearing test results from localStorage:", error);
    }
};

export const getExamResult = (examId: string): ExamResult[] => {
    try {
        const keys = Object.keys(localStorage).filter((key) =>
            key.startsWith(`examResults-${examId}-`)
        );
        return keys.map((key) => JSON.parse(localStorage.getItem(key) || "{}") as ExamResult);
    } catch (error) {
        console.error("Error retrieving exam result from localStorage:", error);
        return [];
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

export const getExamResultById = (resultId: string): ExamResult | null => {
    try {
        const result = localStorage.getItem(`examResults-${resultId}`);
        return result ? JSON.parse(result) as ExamResult : null;
    } catch (error) {
        console.error("Error retrieving exam result by ID from localStorage:", error);
        return null;
    }
};