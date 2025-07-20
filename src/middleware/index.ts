import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
    // 1. Get the hostname from the request URL.
    const hostname = context.url.hostname;

    // 2. Attach the hostname to `context.locals`. This is a special object
    //    that securely passes data from middleware to your Astro pages.
    context.locals.hostname = hostname;

    // 3. Continue to the next step (either another middleware or rendering the page).
    return next();
});
