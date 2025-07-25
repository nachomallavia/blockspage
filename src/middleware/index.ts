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
    const isMain = allowedHosts.includes(hostname);

    if (pathname.startsWith('/main') && !isMain) {
        // Redirect to the subdomain's home route
        return context.redirect('/', 302);
    } else if (isMain && pathname === '/') {
        return context.rewrite('/main');
    }
    context.locals.hostname = hostname;
    return next();
});
