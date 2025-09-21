-- Fix RLS policies to allow access without Supabase auth
-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all data" ON admins;
DROP POLICY IF EXISTS "Voters can read own data" ON voters;
DROP POLICY IF EXISTS "Anyone can read candidates" ON candidates;
DROP POLICY IF EXISTS "Voters can insert own votes" ON votes;
DROP POLICY IF EXISTS "Anyone can read votes" ON votes;

-- Create new policies that allow public access for this demo app
-- In production, you should use proper Supabase auth

-- Allow anyone to read admin data (for login)
CREATE POLICY "Anyone can read admins"
  ON admins
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to read voter data (for login)
CREATE POLICY "Anyone can read voters"
  ON voters
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to read candidates
CREATE POLICY "Anyone can read candidates"
  ON candidates
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert votes
CREATE POLICY "Anyone can insert votes"
  ON votes
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to read votes
CREATE POLICY "Anyone can read votes"
  ON votes
  FOR SELECT
  TO public
  USING (true);
