import { supabase } from '@/backend/lib/supabase';
import { ExamResult } from '@/types/ExamResult';

export const saveExamResult = async (examResult: ExamResult, userId: string) => {
    try {
        const { data, error } = await supabase
            .from('examResults')
            .insert([{
                examId: examResult.examId,
                examType: examResult.examType,
                startTime: examResult.startTime,
                endTime: examResult.endTime,
                questions: examResult.questions.map(question => ({
                    id: question.id,
                    selectedAnswer: question.selectedAnswer,
                    isCorrect: question.isCorrect,
                })),
                isCompleted: examResult.isCompleted,
                currentQuestionIndex: examResult.currentQuestionIndex,
                userId: userId
            }])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error saving exam result:', error);
        throw error;
    }
};

export const getExamResultById = async (resultId: string) => {
    try {
        const { data, error } = await supabase
            .from('examResults')
            .select('*')
            .eq('resultId', resultId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error getting exam result:', error);
        throw error;
    }
};

export const getIncompleteExamResult = async (examId: string, userId: string) => {
    try {
        const { data, error } = await supabase
            .from('examResults')
            .select('*')
            .eq('examId', examId)
            .eq('userId', userId)
            .eq('isCompleted', false)
            .single();  

        if (error) throw error;
        return data;
    } catch (error) {
        // console.log('Error getting incomplete exam result:', error);
        // throw error;
        return null;
    }
};  

export const getExamResultsByExamId = async (examId: string, userId: string) => {
    try {
        const { data, error } = await supabase
            .from('examResults')
            .select('*')
            .eq('examId', examId)
            .eq('userId', userId)
            .eq('isCompleted', true)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error getting exam results:', error);
        throw error;
    }
};

export const updateExamResult = async (resultId: string, examResult: Partial<ExamResult>) => {
    try {
        const { data, error } = await supabase
            .from('examResults')
            .update({
                questions: examResult.questions,
                endTime: examResult.endTime,
                isCompleted: examResult.isCompleted,
                currentQuestionIndex: examResult.currentQuestionIndex
            })
            .eq('resultId', resultId)
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating exam result:', error);
        throw error;
    }
}; 