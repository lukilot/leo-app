import { createClient } from '@supabase/supabase-js';

const rawEnvUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const cleanEnvUrl = rawEnvUrl.trim();

const supabaseUrl = cleanEnvUrl.startsWith('http')
    ? cleanEnvUrl
    : 'https://placeholder.supabase.co';

const rawEnvKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseKey = rawEnvKey.trim() || 'placeholder_key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("LEO: Using placeholder Supabase credentials.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
