import { defineMiddleware } from 'astro:middleware';
import { supabase } from '../db/supabase.js';

export const onRequest = defineMiddleware(async (context, next) => {
    const hostname = context.url.hostname;
    const pathname = context.url.pathname;

    console.log(hostname);

    // Handle www redirect
    if (hostname.startsWith('www.')) {
        const url = new URL(context.url);
        url.hostname = hostname.replace('www.', '');
        return context.redirect(`${url.toString()}:${url.port}`, 301);
    }

    // Restrict /main to allowed hosts only
    const allowedHosts = ['blockspage.com', 'localhost', '127.0.0.1'];
    const isMain = allowedHosts.includes(hostname);

    if (pathname.startsWith('/main') && !isMain) {
        return context.redirect('/', 302);
    } else if (isMain && pathname === '/') {
        return context.rewrite('/main');
    }

    // Authentication for /app/* routes on main domain
    if (isMain && pathname.startsWith('/app/')) {
        const accessToken = context.cookies.get('sb-access-token');
        const refreshToken = context.cookies.get('sb-refresh-token');

        if (!accessToken || !refreshToken) {
            return context.redirect('/auth/login');
        }

        try {
            // Verify and refresh session
            const { data, error } = await supabase.auth.setSession({
                refresh_token: refreshToken.value,
                access_token: accessToken.value,
            });

            if (error || !data.session) {
                // Clear invalid cookies and redirect
                context.cookies.delete('sb-access-token', { path: '/' });
                context.cookies.delete('sb-refresh-token', { path: '/' });
                return context.redirect('/auth/login');
            }

            // Update cookies with refreshed tokens if they changed
            if (data.session.access_token !== accessToken.value) {
                context.cookies.set(
                    'sb-access-token',
                    data.session.access_token,
                    {
                        path: '/',
                        secure: true,
                        httpOnly: true,
                        sameSite: 'lax',
                    }
                );
            }
            if (data.session.refresh_token !== refreshToken.value) {
                context.cookies.set(
                    'sb-refresh-token',
                    data.session.refresh_token,
                    {
                        path: '/',
                        secure: true,
                        httpOnly: true,
                        sameSite: 'lax',
                    }
                );
            }

            // Set user in context for protected pages
            context.locals.user = data.user;
            context.locals.session = data.session;
        } catch (error) {
            // Clear cookies and redirect on error
            console.error('Auth middleware error:', error);
            context.cookies.delete('sb-access-token', { path: '/' });
            context.cookies.delete('sb-refresh-token', { path: '/' });
            return context.redirect('/auth/login');
        }
    }

    context.locals.hostname = hostname;
    return next();
});
