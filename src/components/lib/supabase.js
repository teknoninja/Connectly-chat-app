import { createClient } from '@supabase/supabase-js';

// Get your Supabase URL and anon key from your project settings
// Or, for better security, use environment variables
const supabaseUrl = 'https://mxpqjdyzvducqqvrlxvv.supabase.co'; // Paste your Project URL here
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14cHFqZHl6dmR1Y3FxdnJseHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjgzNzMsImV4cCI6MjA3MTYwNDM3M30.M5pehMO8OHsB4ibFoaObHr52xorc-m1-QZQGtVJlLUg'; // Paste your anon key here

export const supabase = createClient(supabaseUrl, supabaseAnonKey);