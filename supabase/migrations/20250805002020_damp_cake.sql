/*
  # Complete Database Schema for Pit Exit Platform

  1. New Tables
    - `users` - User profiles with authentication integration
    - `businesses` - Business entities owned by users
    - `ai_results` - AI-generated content and analysis results
    - `work_plans` - Strategic work plans for businesses
    - `work_phases` - Phases within work plans
    - `tasks` - Individual tasks within phases

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Ensure proper data isolation between users

  3. Features
    - User profile management with plan tracking
    - Multi-business support per user
    - AI result storage and categorization
    - Structured work plan management
    - Task tracking and status management
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  country text DEFAULT 'Chile',
  city text,
  industry text,
  experience text DEFAULT 'Principiante',
  plan text DEFAULT 'Gratis',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  industry text,
  stage text DEFAULT 'Idea',
  founded_date date,
  employees integer DEFAULT 1,
  location text,
  website text,
  email text,
  phone text,
  revenue text,
  target_market text,
  business_model text,
  key_products text[],
  competitors text[],
  unique_value text,
  challenges text[],
  goals text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ai_results table
CREATE TABLE IF NOT EXISTS ai_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('hack_analysis', 'work_plan', 'content_reel_script', 'table_comparison', 'flow_diagram_textual')),
  title text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create work_plans table
CREATE TABLE IF NOT EXISTS work_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  estimated_duration text,
  priority text DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create work_phases table
CREATE TABLE IF NOT EXISTS work_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_plan_id uuid REFERENCES work_plans(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  estimated_days integer DEFAULT 0,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id uuid REFERENCES work_phases(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  estimated_hours integer DEFAULT 0,
  due_date timestamptz,
  assignee text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

-- Create policies for businesses table
CREATE POLICY "Users can read own businesses"
  ON businesses
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can create businesses"
  ON businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update own businesses"
  ON businesses
  FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete own businesses"
  ON businesses
  FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Create policies for ai_results table
CREATE POLICY "Users can read own AI results"
  ON ai_results
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can create AI results"
  ON ai_results
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update own AI results"
  ON ai_results
  FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete own AI results"
  ON ai_results
  FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Create policies for work_plans table
CREATE POLICY "Users can read own work plans"
  ON work_plans
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can create work plans"
  ON work_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update own work plans"
  ON work_plans
  FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete own work plans"
  ON work_plans
  FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Create policies for work_phases table
CREATE POLICY "Users can read own work phases"
  ON work_phases
  FOR SELECT
  TO authenticated
  USING (work_plan_id IN (SELECT id FROM work_plans WHERE user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())));

CREATE POLICY "Users can create work phases"
  ON work_phases
  FOR INSERT
  TO authenticated
  WITH CHECK (work_plan_id IN (SELECT id FROM work_plans WHERE user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())));

CREATE POLICY "Users can update own work phases"
  ON work_phases
  FOR UPDATE
  TO authenticated
  USING (work_plan_id IN (SELECT id FROM work_plans WHERE user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())));

CREATE POLICY "Users can delete own work phases"
  ON work_phases
  FOR DELETE
  TO authenticated
  USING (work_plan_id IN (SELECT id FROM work_plans WHERE user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())));

-- Create policies for tasks table
CREATE POLICY "Users can read own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (phase_id IN (
    SELECT wp.id FROM work_phases wp
    JOIN work_plans wpl ON wp.work_plan_id = wpl.id
    WHERE wpl.user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
  ));

CREATE POLICY "Users can create tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (phase_id IN (
    SELECT wp.id FROM work_phases wp
    JOIN work_plans wpl ON wp.work_plan_id = wpl.id
    WHERE wpl.user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
  ));

CREATE POLICY "Users can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (phase_id IN (
    SELECT wp.id FROM work_phases wp
    JOIN work_plans wpl ON wp.work_plan_id = wpl.id
    WHERE wpl.user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
  ));

CREATE POLICY "Users can delete own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (phase_id IN (
    SELECT wp.id FROM work_phases wp
    JOIN work_plans wpl ON wp.work_plan_id = wpl.id
    WHERE wpl.user_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_results_business_id ON ai_results(business_id);
CREATE INDEX IF NOT EXISTS idx_ai_results_user_id ON ai_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_results_type ON ai_results(type);
CREATE INDEX IF NOT EXISTS idx_work_plans_business_id ON work_plans(business_id);
CREATE INDEX IF NOT EXISTS idx_work_plans_user_id ON work_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_work_phases_work_plan_id ON work_phases(work_plan_id);
CREATE INDEX IF NOT EXISTS idx_tasks_phase_id ON tasks(phase_id);

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (auth_user_id, email, username, first_name, last_name, phone, city, industry, experience)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'industry',
    COALESCE(new.raw_user_meta_data->>'experience', 'Principiante')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_ai_results_updated_at BEFORE UPDATE ON ai_results FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_work_plans_updated_at BEFORE UPDATE ON work_plans FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_work_phases_updated_at BEFORE UPDATE ON work_phases FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();