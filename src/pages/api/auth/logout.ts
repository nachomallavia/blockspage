import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase.js';

export const GET: APIRoute = async ({ cookies, redirect }) => {
    try {
        // Get tokens from cookies
        const accessToken = cookies.get('sb-access-token');
        const refreshToken = cookies.get('sb-refresh-token');

        if (accessToken && refreshToken) {
            // Set session and sign out
            await supabase.auth.setSession({
                access_token: accessToken.value,
                refresh_token: refreshToken.value,
            });

            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Logout error:', error);
            }
        }

        // Clear cookies regardless of Supabase response
        cookies.delete('sb-access-token', {
            path: '/',
        });
        cookies.delete('sb-refresh-token', {
            path: '/',
        });

        return new Response(JSON.stringify({ message: 'Logout successful' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        // Even if there's an error, clear cookies and return success
        cookies.delete('sb-access-token', {
            path: '/',
        });
        cookies.delete('sb-refresh-token', {
            path: '/',
        });

        return new Response(JSON.stringify({ message: 'Logout completed' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
