/*
  # Initial Schema for Pit Exit Platform

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `auth_user_id` (uuid, references auth.users)
      - `email` (text, unique)
      - `username` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `phone` (text)
      - `country` (text, default 'Chile')
      - `city` (text)
      - `industry` (text)
      - `experience` (text, default 'Principiante')
      - `plan` (text, default 'Pitexit Go-Kart')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `businesses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `name` (text)
      - `description` (text)
      - `industry` (text)
      - `stage` (text, default 'Idea')
      - `founded_date` (date)
      - `employees` (integer, default 1)
      - `location` (text, default 'Chile')
      - `website` (text)
      - `email` (text)
      - `phone` (text)
      - `revenue` (text, default '$0')
      - `target_market` (text)
      - `business_model` (text)
      - `key_products` (text[])
      - `competitors` (text[])
      - `unique_value` (text)
      - `challenges` (text[])
      - `goals` (text[])
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `ai_results`
      - `id` (uuid, primary key)
      - `business_id` (uuid, references businesses)
      - `user_id` (uuid, references users)
      - `type` (text, check constraint)
      - `title` (text)
      - `content` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `work_plans`
      - `id` (uuid, primary key)
      - `business_id` (uuid, references businesses)
      - `user_id` (uuid, references users)
      - `title` (text)
      - `description` (text)
      - `estimated_duration` (text)
      - `priority` (text, check constraint)
      - `status` (text, check constraint)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `work_phases`
      - `id` (uuid, primary key)
      - `work_plan_id` (uuid, references work_plans)
      - `title` (text)
      - `description` (text)
      - `status` (text, check constraint)
      - `estimated_days` (integer)
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `tasks`
      - `id` (uuid, primary key)
      - `phase_id` (uuid, references work_phases)
      - `title` (text)
      - `description` (text)
      - `status` (text, check constraint)
      - `priority` (text, check constraint)
      - `estimated_hours` (integer)
      - `due_date` (timestamp)
      - `assignee` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

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
  plan text DEFAULT 'Pitexit Go-Kart',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on auth_user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  industry text,
  stage text DEFAULT 'Idea',
  founded_date date,
  employees integer DEFAULT 1,
  location text DEFAULT 'Chile',
  website text,
  email text,
  phone text,
  revenue text DEFAULT '$0',
  target_market text,
  business_model text,
  key_products text[] DEFAULT '{}',
  competitors text[] DEFAULT '{}',
  unique_value text,
  challenges text[] DEFAULT '{}',
  goals text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);

-- Enable RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Create policies for businesses table
CREATE POLICY "Users can read own businesses"
  ON businesses
  FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own businesses"
  ON businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can update own businesses"
  ON businesses
  FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own businesses"
  ON businesses
  FOR DELETE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

-- Create trigger for updated_at
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create ai_results table
CREATE TABLE IF NOT EXISTS ai_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('hack_analysis', 'work_plan', 'content_reel_script', 'table_comparison', 'flow_diagram_textual')),
  title text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_results_business_id ON ai_results(business_id);
CREATE INDEX IF NOT EXISTS idx_ai_results_user_id ON ai_results(user_id);

-- Enable RLS
ALTER TABLE ai_results ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_results table
CREATE POLICY "Users can read own ai_results"
  ON ai_results
  FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own ai_results"
  ON ai_results
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can update own ai_results"
  ON ai_results
  FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own ai_results"
  ON ai_results
  FOR DELETE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

-- Create trigger for updated_at
CREATE TRIGGER update_ai_results_updated_at
  BEFORE UPDATE ON ai_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create work_plans table
CREATE TABLE IF NOT EXISTS work_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  estimated_duration text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_work_plans_business_id ON work_plans(business_id);

-- Enable RLS
ALTER TABLE work_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for work_plans table
CREATE POLICY "Users can read own work_plans"
  ON work_plans
  FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own work_plans"
  ON work_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can update own work_plans"
  ON work_plans
  FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own work_plans"
  ON work_plans
  FOR DELETE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  ));

-- Create trigger for updated_at
CREATE TRIGGER update_work_plans_updated_at
  BEFORE UPDATE ON work_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create work_phases table
CREATE TABLE IF NOT EXISTS work_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_plan_id uuid NOT NULL REFERENCES work_plans(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  estimated_days integer NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_work_phases_work_plan_id ON work_phases(work_plan_id);

-- Enable RLS
ALTER TABLE work_phases ENABLE ROW LEVEL SECURITY;

-- Create policies for work_phases table
CREATE POLICY "Users can read own work_phases"
  ON work_phases
  FOR SELECT
  TO authenticated
  USING (work_plan_id IN (
    SELECT id FROM work_plans WHERE user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert own work_phases"
  ON work_phases
  FOR INSERT
  TO authenticated
  WITH CHECK (work_plan_id IN (
    SELECT id FROM work_plans WHERE user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can update own work_phases"
  ON work_phases
  FOR UPDATE
  TO authenticated
  USING (work_plan_id IN (
    SELECT id FROM work_plans WHERE user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can delete own work_phases"
  ON work_phases
  FOR DELETE
  TO authenticated
  USING (work_plan_id IN (
    SELECT id FROM work_plans WHERE user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  ));

-- Create trigger for updated_at
CREATE TRIGGER update_work_phases_updated_at
  BEFORE UPDATE ON work_phases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id uuid NOT NULL REFERENCES work_phases(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  estimated_hours integer NOT NULL,
  due_date timestamptz,
  assignee text,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_phase_id ON tasks(phase_id);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks table
CREATE POLICY "Users can read own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (phase_id IN (
    SELECT wp.id FROM work_phases wp
    JOIN work_plans wpl ON wp.work_plan_id = wpl.id
    WHERE wpl.user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (phase_id IN (
    SELECT wp.id FROM work_phases wp
    JOIN work_plans wpl ON wp.work_plan_id = wpl.id
    WHERE wpl.user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (phase_id IN (
    SELECT wp.id FROM work_phases wp
    JOIN work_plans wpl ON wp.work_plan_id = wpl.id
    WHERE wpl.user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can delete own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (phase_id IN (
    SELECT wp.id FROM work_phases wp
    JOIN work_plans wpl ON wp.work_plan_id = wpl.id
    WHERE wpl.user_id IN (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  ));

-- Create trigger for updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (auth_user_id, email, username, first_name, last_name, phone, city, industry, experience)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'industry',
    COALESCE(NEW.raw_user_meta_data->>'experience', 'Principiante')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();