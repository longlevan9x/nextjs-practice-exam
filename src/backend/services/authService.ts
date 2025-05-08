import { supabase } from '@/backend/lib/supabase/client';

export const getCurrentUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.log('Error getting current user:', error);
        throw error
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
