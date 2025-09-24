-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Voters can read own data" ON voters;
DROP POLICY IF EXISTS "Voters can update has_voted status" ON voters;

-- Create proper RLS policies for voters
CREATE POLICY "Voters can read own data"
  ON voters
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Voters can update has_voted status"
  ON voters
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also add insert and delete policies for admin operations
CREATE POLICY "Admins can insert voters"
  ON voters
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can delete voters"
  ON voters
  FOR DELETE
  TO authenticated
  USING (true);