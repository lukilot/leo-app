import { createClient } from '@supabase/supabase-js';

// Sanitize the URL by trimming any accidental invisible whitespace/newlines 
// from copy-pasting into the Vercel Dashboard
const rawEnvUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const cleanEnvUrl = rawEnvUrl.trim();

// Ensure we pass a strictly valid URL
const supabaseUrl = cleanEnvUrl.startsWith('http')
    ? cleanEnvUrl
    : 'https://placeholder.supabase.co';

const rawEnvKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseKey = rawEnvKey.trim() || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseKey);
