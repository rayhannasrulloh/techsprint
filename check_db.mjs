import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("No supabase credentials found.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('settings').select('*');
  console.log("settings table:", { data, error });
  
  const { data: data2, error: error2 } = await supabase.from('app_config').select('*');
  console.log("app_config table:", { data: data2, error: error2 });
}

check();
