import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
    // 1. Get the hostname from the request URL.
    const hostname = context.url.hostname;
    let nakedHostname = 'el hostname contiene www';
    if (hostname.includes('www.')) {
        context.locals.hostname = nakedHostname;
    } else {
        context.locals.hostname = hostname;
    }

    return next();
});
