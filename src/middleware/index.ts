import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
    const hostname = context.url.hostname;
    const pathname = context.url.pathname;
    console.log(hostname);
    if (hostname.startsWith('www.')) {
        // Redirect to non-www, preserving path and query
        const url = new URL(context.url);
        url.hostname = hostname.replace('www.', '');
        return context.redirect(`${url.toString()}:${url.port}`, 301);
    }

    // Restrict /main to allowed hosts only
    const allowedHosts = ['blockspage.com', 'localhost', '127.0.0.1'];
    if (pathname.startsWith('/main') && !allowedHosts.includes(hostname)) {
        // Redirect to the subdomain's home route
        return context.redirect('/', 302);
    }

    context.locals.hostname = hostname;
    return next();
});
