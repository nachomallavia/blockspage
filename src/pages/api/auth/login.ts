import type { APIRoute } from 'astro';
import { supabase } from '../../../db/supabase.js';
import type { Provider } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    try {
        const formData = await request.formData();
        const email = formData.get('email')?.toString();
        const password = formData.get('password')?.toString();
        const provider = formData.get('provider')?.toString();

        // Debug logging
        console.log('Login attempt:', {
            hasEmail: !!email,
            hasPassword: !!password,
            provider: provider || 'none',
        });

        const validProviders = ['google', 'github', 'discord'];

        // Handle OAuth provider login
        if (provider && validProviders.includes(provider)) {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: provider as Provider,
                options: {
                    redirectTo: `${new URL(request.url).origin}/api/auth/callback`,
                },
            });

            if (error) {
                return new Response(JSON.stringify({ error: error.message }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            return redirect(data.url);
        }

        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: 'Email and password are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Handle email/password login
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { access_token, refresh_token } = data.session;

        // Set HTTP-only cookies for security
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
        // return new Response(
        //     JSON.stringify({
        //         user: data.user,
        //         session: data.session,
        //         message: 'Login successful',
        //     }),
        //     {
        //         status: 200,
        //         headers: { 'Content-Type': 'application/json' },
        //     }
        // );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
