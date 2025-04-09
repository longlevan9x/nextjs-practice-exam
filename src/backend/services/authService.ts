import { supabase } from '@/backend/lib/supabase';

export const getCurrentUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

export const isAuthenticated = async () => {
    const user = await getCurrentUser();
    return !!user;
};

export const getUserId = async () => {
    const user = await getCurrentUser();
    return user?.id;
};
