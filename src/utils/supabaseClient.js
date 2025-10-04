import { createClient } from '@supabase/supabase-js'

console.log('SupabaseClient: Initializing...');

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('SupabaseClient: Environment variables', { 
  supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
  supabaseAnonKey: supabaseAnonKey ? 'SET' : 'NOT SET'
});

// Check if environment variables are set
let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    console.log('SupabaseClient: Creating client...');
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('SupabaseClient: Initialized successfully');
  } catch (error) {
    console.error('SupabaseClient: Error initializing client:', error);
  }
} else {
  console.warn('SupabaseClient: Environment variables are not set. Using localStorage only.');
}

export { supabase };