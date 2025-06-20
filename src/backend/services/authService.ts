import { supabase } from '@/backend/lib/supabase/client';

export const getCurrentUser = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        return session?.user;
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


export const getCurrentUserWithoutError = async () => {
    try {
        const user = await getCurrentUser();
        return user;
    } catch (error) {
        console.log('Error getting current user without throwing:', error);
        return null; // Return null if there's an error
    }
}