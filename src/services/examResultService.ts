import { createExamResult, getAllExamResults, getAllExamResultsByExamId, getExamResultById as getLocalExamResultById, saveExamResultByResultId } from './localStorageService';
import { saveExamResult, getExamResultById, getExamResultsByExamId, getIncompleteExamResults as getBackendIncompleteExamResults, getIncompleteExamResult as getBackendIncompleteExamResult, updateExamResult } from '@/backend/services/examResultService';
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
        return getAllExamResultsByExamId(examId).filter(result => result.isCompleted);
    }
};

export const getIncompleteExamResult = async (examId: string) => {
    const currentUser = await getCurrentUser();

    if (currentUser) {
        // Get from database
        return await getBackendIncompleteExamResult(examId, currentUser.id);
    } else {
        // Get from localStorage
        return getAllExamResultsByExamId(examId).find(result => !result.isCompleted);
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

    if (examResult.questions) {
        examResult.questions = examResult.questions.map((question) => ({
            id: question.id,
            selectedAnswer: question.selectedAnswer,
            isCorrect: question.isCorrect,
            questionIndex: question.questionIndex
        }));
    }  

    if (isUserAuthenticated) {
        // Update in database
        return await updateExamResult(resultId, examResult);
    } else {
        // Update in localStorage
        if (!examResult.examId || !examResult.resultId) {
            return null;
        }

        saveExamResultByResultId(examResult.examId, examResult.resultId, examResult);
       
        return examResult;
    }
}; 

export const initializeExamResult = async (examResult: ExamResult) => {
    examResult.currentQuestionIndex = 0;
    examResult.startTime = new Date().toISOString();
    examResult.isCompleted = false;
    
    examResult.questions = examResult.questions.map((question, index) => ({
        ...question,
        questionIndex: index
    }));

    return saveExamResultData(examResult);
};

// Function to get exams with their progress status
export const getIncompleteExamResults = async (): Promise<ExamResult[]> => {
    const currentUser = await getCurrentUser();

    if (currentUser) {
        // Get from database
        return await getBackendIncompleteExamResults(currentUser.id);
    } else {
        // Get from localStorage
        return getAllExamResults().filter(result => !result.isCompleted);
    }
};
