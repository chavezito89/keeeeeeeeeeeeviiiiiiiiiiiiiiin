import { createClient } from "@supabase/supabase-js";

// This is a placeholder for your Supabase client.
// 1. Create a new project on https://supabase.com/.
// 2. Go to Project Settings > API.
// 3. Find your Project URL and anon key.
// 4. Create a .env.local file in your project root.
// 5. Add your keys to .env.local:
//    NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
