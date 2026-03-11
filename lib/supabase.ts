import { createClient } from '@supabase/supabase-js';

// Tambahkan 'as string' agar TypeScript tahu ini pasti text
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Supabase client initialized successfully.");