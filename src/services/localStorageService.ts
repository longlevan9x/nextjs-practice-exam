import { ExamResult } from "@/types/ExamResult";

export const saveTestResults = (examId: string, data: object) => {
    try {
        const timestamp = new Date().toISOString();
        const resultWithTimestamp = { ...data, timestamp };
        localStorage.setItem(`examResults-${examId}-${timestamp}`, JSON.stringify(resultWithTimestamp));
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