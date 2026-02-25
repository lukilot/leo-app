import { createClient } from '@supabase/supabase-js';

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Ensure we pass a strictly valid URL even if Vercel injects weird strings during build
const supabaseUrl = envUrl && envUrl.startsWith('http')
    ? envUrl
    : 'https://placeholder.supabase.co';

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseKey);
