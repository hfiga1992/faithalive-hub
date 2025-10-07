-- Allow Pastors and Leaders to update profiles of members in their church
CREATE POLICY "Pastors and leaders can update profiles in their church"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    church_id = public.get_user_church_id(auth.uid())
    AND (
      public.has_role(auth.uid(), 'PASTOR') OR 
      public.has_role(auth.uid(), 'LEADER')
    )
  )
  WITH CHECK (
    church_id = public.get_user_church_id(auth.uid())
    AND (
      public.has_role(auth.uid(), 'PASTOR') OR 
      public.has_role(auth.uid(), 'LEADER')
    )
  );


