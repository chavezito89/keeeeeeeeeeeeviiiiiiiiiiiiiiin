import { createClient } from "@supabase/supabase-js";

// This is the server-side Supabase client.
// It uses the service role key for operations that require elevated privileges.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);
