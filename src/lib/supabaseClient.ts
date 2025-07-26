// filepath: c:\Users\subham sahoo s\OneDrive\Desktop\agrismart\agri-sahayak-samriddhi\src\lib\supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://niovzywctricuuyxfddw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pb3Z6eXdjdHJpY3V1eXhmZGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjE0MjIsImV4cCI6MjA2ODkzNzQyMn0.8GPMTB1QP0jdhfxpaZw6oC7EdgHNYYngNiWaU4cGCVs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);