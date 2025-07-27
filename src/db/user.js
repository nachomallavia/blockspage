import { supabase } from './supabase.js';

export const register = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
};

export const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
};
export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });
    return { data, error };
};
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};
export const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
};
