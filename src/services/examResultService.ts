import { createExamResult, getAllExamResults, getExamResultById as getLocalExamResultById, saveExamResultByResultId } from './localStorageService';
import { saveExamResult, getExamResultById, getExamResultsByExamId, getIncompleteExamResult as getBackendIncompleteExamResult, updateExamResult } from '@/backend/services/examResultService';
import { getCurrentUser, isAuthenticated } from '../backend/services/authService';
import { ExamResult } from '@/types/ExamResult';

export const saveExamResultData = async (examResult: ExamResult) => {
    const currentUser = await getCurrentUser();

    if (currentUser) {
        // Save to database
        return await saveExamResult(examResult, currentUser.id);
    } else {
        // Save to localStorage
        createExamResult(examResult.examId, examResult);
        return examResult;
    }
};

export const getExamResults = async (examId: string) => {
    const currentUser = await getCurrentUser();

    if (currentUser) {
        // Get from database
        return await getExamResultsByExamId(examId, currentUser.id);
    } else {
        // Get from localStorage
        return getAllExamResults(examId).filter(result => result.isCompleted);
    }
};

export const getIncompleteExamResult = async (examId: string) => {
    const currentUser = await getCurrentUser();

    if (currentUser) {
        // Get from database
        return await getBackendIncompleteExamResult(examId, currentUser.id);
    } else {
        // Get from localStorage
        return getAllExamResults(examId).find(result => !result.isCompleted);
    }
};

export const getExamResult = async (examId: string, resultId: string) => {
    const isUserAuthenticated = await isAuthenticated();

    if (isUserAuthenticated) {
        // Get from database
        return await getExamResultById(resultId);
    } else {
        // Get from localStorage
        return getLocalExamResultById(examId, resultId);
    }
};

export const updateExamResultData = async (resultId: string, examResult: ExamResult) => {
    const isUserAuthenticated = await isAuthenticated();

    if (isUserAuthenticated) {
        // Update in database
        return await updateExamResult(resultId, examResult);
    } else {
        // Update in localStorage
        if (!examResult.examId || !examResult.resultId) {
            return null;
        }

        saveExamResultByResultId(parseInt(examResult.examId), examResult.resultId, examResult);
       
        return examResult;
    }
}; 