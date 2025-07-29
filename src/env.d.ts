/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        hostname: string;
        user?: any; // Supabase User object
        session?: any; // Supabase Session object
    }
}
