import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// This is the server-side Supabase client.
// It uses the service role key for operations that require elevated privileges.
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);
