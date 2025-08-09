/*
  # Multi-tenant Architecture Schema

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `domain` (text, nullable, unique)
      - `logo_url` (text, nullable)
      - `created_at` (timestamptz, default now())
    - `members`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects.id)
      - `user_id` (uuid, nullable, foreign key to auth.users.id)
      - `role` (text, check constraint for 'owner' | 'editor' | 'viewer')
      - `invited_email` (text, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for project access control
    - Add policies for member management

  3. Indexes
    - Add indexes for performance optimization
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  domain text UNIQUE,
  logo_url text,
  created_at timestamptz DEFAULT now()
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'viewer',
  invited_email text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT members_role_check CHECK (role IN ('owner', 'editor', 'viewer')),
  CONSTRAINT members_user_or_email_check CHECK (
    (user_id IS NOT NULL AND invited_email IS NULL) OR 
    (user_id IS NULL AND invited_email IS NOT NULL)
  )
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_domain ON projects(domain);
CREATE INDEX IF NOT EXISTS idx_members_project_id ON members(project_id);
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_invited_email ON members(invited_email);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view projects they are members of"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT project_id 
      FROM members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Project owners can update projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT project_id 
      FROM members 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

CREATE POLICY "Project owners can delete projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (
    id IN (
      SELECT project_id 
      FROM members 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- Members policies
CREATE POLICY "Users can view members of their projects"
  ON members
  FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT project_id 
      FROM members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners and editors can invite members"
  ON members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IN (
      SELECT project_id 
      FROM members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  );

CREATE POLICY "Project owners and editors can update members"
  ON members
  FOR UPDATE
  TO authenticated
  USING (
    project_id IN (
      SELECT project_id 
      FROM members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  );

CREATE POLICY "Project owners can delete members"
  ON members
  FOR DELETE
  TO authenticated
  USING (
    project_id IN (
      SELECT project_id 
      FROM members 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- Function to automatically add project creator as owner
CREATE OR REPLACE FUNCTION handle_new_project()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO members (project_id, user_id, role)
  VALUES (NEW.id, auth.uid(), 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically add project creator as owner
DROP TRIGGER IF EXISTS on_project_created ON projects;
CREATE TRIGGER on_project_created
  AFTER INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION handle_new_project();