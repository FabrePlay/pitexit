import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('🔧 Supabase client initialized:', supabaseUrl ? 'URL loaded' : 'URL missing', supabaseAnonKey ? 'Anon Key loaded' : 'Anon Key missing');
console.log('🔧 Supabase URL:', supabaseUrl);
console.log('🔧 Supabase Anon Key (first 20 chars):', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'missing');

// Types for our database schema
export interface User {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  country?: string;
  city?: string;
  industry?: string;
  experience?: string;
  plan: string;
  created_at: string;
  updated_at: string;
  businesses?: string[];
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  description: string;
  industry?: string;
  stage: string;
  founded_date?: string;
  employees?: number;
  location?: string;
  website?: string;
  email?: string;
  phone?: string;
  revenue?: string;
  target_market?: string;
  business_model?: string;
  key_products?: string[];
  competitors?: string[];
  unique_value?: string;
  challenges?: string[];
  goals?: string[];
  created_at: string;
  updated_at: string;
}

export interface AIResult {
  id: string;
  business_id: string;
  user_id: string;
  type: 'hack_analysis' | 'work_plan' | 'content_reel_script' | 'table_comparison' | 'flow_diagram_textual';
  title: string;
  content: any;
  created_at: string;
  updated_at: string;
}

export interface WorkPlan {
  id: string;
  business_id: string;
  user_id: string;
  title: string;
  description: string;
  estimated_duration: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
  phases: WorkPhase[];
  created_at: string;
  updated_at: string;
}

export interface WorkPhase {
  id: string;
  work_plan_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  estimated_days: number;
  order_index: number;
  tasks: Task[];
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  phase_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  estimated_hours: number;
  due_date?: string;
  assignee?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}