-- Fix 1: Remove public exposure of church data during registration
-- Drop the existing policy that allows viewing churches without profiles
DROP POLICY IF EXISTS "Users can view their own church" ON public.churches;

-- Create a secure policy that only allows users to view their own church
CREATE POLICY "Users can view their own church"
ON public.churches
FOR SELECT
USING (id = get_user_church_id(auth.uid()));

-- Fix 2: Secure the avatars storage bucket
-- Make avatars bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'avatars';

-- Drop existing storage policies to recreate them
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can view avatars in their church" ON storage.objects;

-- Add RLS policies for avatar storage
CREATE POLICY "Users can view avatars in their church"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'avatars' 
  AND (
    -- Allow viewing own avatar
    auth.uid()::text = (storage.foldername(storage.objects.name))[1]
    OR
    -- Allow viewing avatars of users in same church
    EXISTS (
      SELECT 1 FROM profiles p1
      CROSS JOIN profiles p2
      WHERE p1.id = auth.uid()
        AND p2.id = ((storage.foldername(storage.objects.name))[1])::uuid
        AND p1.church_id = p2.church_id
    )
  )
);

CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);