-- Add INSERT policy for churches table to allow church registration
CREATE POLICY "Allow church registration"
  ON public.churches
  FOR INSERT
  WITH CHECK (true);

-- Update SELECT policy to be more permissive during initial setup
DROP POLICY IF EXISTS "Users can view their own church" ON public.churches;

CREATE POLICY "Users can view their own church"
  ON public.churches
  FOR SELECT
  USING (
    -- Allow viewing if user is authenticated and church_id matches
    -- OR if the church was just created (no users yet)
    id = get_user_church_id(auth.uid())
    OR NOT EXISTS (
      SELECT 1 FROM profiles WHERE church_id = churches.id
    )
  );