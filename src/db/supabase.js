import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

if (!supabaseUrl) {
    throw new Error(
        'SUPABASE_URL environment variable is required. Please add it to your .env file.'
    );
}

if (!supabaseKey) {
    throw new Error(
        'SUPABASE_KEY environment variable is required. Please add it to your .env file.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        flowType: 'pkce',
    },
});
