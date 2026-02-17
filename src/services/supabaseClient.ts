
import { createClient } from '@supabase/supabase-js';

// Safe way to get environment variables in Vite
const SUPABASE_URL = (import.meta.env?.VITE_SUPABASE_URL as string) || (process.env.REACT_APP_SUPABASE_URL as string) || 'https://mbhywoobtsgrppdufzjy.supabase.co';
const SUPABASE_ANON_KEY = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string) || (process.env.REACT_APP_SUPABASE_ANON_KEY as string) || 'sb_publishable_ORqubZWwfMgdV3kLycYeeg_tJjuTpK-';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
