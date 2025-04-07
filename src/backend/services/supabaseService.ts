import { supabase } from '@/backend/lib/supabase';
import { ExamResult } from '@/types/ExamResult';

export const saveExamResult = async (result: ExamResult) => {
  const { data, error } = await supabase
    .from('exam_results')
    .insert([result])
    .select();

  if (error) throw error;
  return data[0];
};

export const getExamResults = async (userId: string) => {
  const { data, error } = await supabase
    .from('exam_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getExamResultById = async (resultId: string) => {
  const { data, error } = await supabase
    .from('exam_results')
    .select('*')
    .eq('id', resultId)
    .single();

  if (error) throw error;
  return data;
}; 