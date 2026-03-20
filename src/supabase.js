import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * True when both Supabase env vars are present.
 * When false, the app falls back to localStorage-only mode (no auth).
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** Supabase client, or null when not configured */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
