import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * Initializes and exports the Supabase client
 * Uses environment variables for configuration.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
