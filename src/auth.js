import { supabase, isSupabaseConfigured } from './supabase.js';

/**
 * Sign in with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('@supabase/supabase-js').Session>}
 */
export async function signIn(email, password) {
  if (!isSupabaseConfigured) throw new Error('Authentication is not configured.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

/**
 * Sign out the current admin user.
 */
export async function signOut() {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get the active session, or null if not signed in.
 * @returns {Promise<import('@supabase/supabase-js').Session | null>}
 */
export async function getSession() {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Subscribe to authentication state changes.
 * @param {(event: string, session: import('@supabase/supabase-js').Session | null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured) return () => {};
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}
