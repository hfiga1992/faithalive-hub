-- Fix function search_path security warning
-- Recreate get_user_church_id with explicit search_path
CREATE OR REPLACE FUNCTION public.get_user_church_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT church_id
  FROM public.profiles
  WHERE id = _user_id
$$;