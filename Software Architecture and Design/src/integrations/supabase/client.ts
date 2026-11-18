import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client configuration
 * Using environment-specific keys for database connection
 */
const SUPABASE_URL = "https://inwycjnfznqiutokkdix.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlud3ljam5mem5xaXV0b2trZGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMDYzNDUsImV4cCI6MjA5MTY4MjM0NX0.TlWzHAeBQH433nIQHPosMArmYnTW882GqXJcmnk0yLs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);