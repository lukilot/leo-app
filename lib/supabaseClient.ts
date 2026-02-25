import { createClient } from '@supabase/supabase-js';

// Use a fallback URL during Vercel build if env vars aren't injected yet, 
// to prevent "Invalid supabaseUrl" prerendering errors.
// Must be a fully qualified URL for Next.js to parse it cleanly.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseKey);
