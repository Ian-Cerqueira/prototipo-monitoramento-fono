import { createClient } from '@supabase/supabase-js'

// Substitua pelos seus valores do painel do Supabase
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey)