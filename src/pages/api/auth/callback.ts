import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase.js';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
    const authCode = url.searchParams.get('code');

    if (!authCode) {
        return new Response('No code provided', { status: 400 });
    }

    const { data, error } =
        await supabase.auth.exchangeCodeForSession(authCode);

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    const { access_token, refresh_token } = data.session;

    cookies.set('sb-access-token', access_token, {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
    });
    cookies.set('sb-refresh-token', refresh_token, {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
    });

    return redirect('/app/dashboard');
};
