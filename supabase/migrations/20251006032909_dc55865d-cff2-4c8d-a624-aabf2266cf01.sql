-- Fix: Update the user who just registered to have PASTOR role instead of MEMBER
-- This fixes the issue where the first user (pastor) can't access any modules

-- Update the trigger to NOT automatically assign MEMBER role
-- The registration code will handle role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, name, church_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    (NEW.raw_user_meta_data->>'church_id')::UUID
  );
  
  -- Note: Role assignment is now handled by the registration code
  -- Don't automatically assign MEMBER role here
  
  RETURN NEW;
END;
$function$;

-- Fix existing user: Remove MEMBER role and add PASTOR role for the user who registered
-- This is for users who registered before this fix
DO $$
DECLARE
  pastor_user_id uuid;
BEGIN
  -- Find users who have MEMBER role but should be PASTOR (they're the only user in their church)
  FOR pastor_user_id IN 
    SELECT ur.user_id
    FROM user_roles ur
    JOIN profiles p ON p.id = ur.user_id
    WHERE ur.role = 'MEMBER'
    AND NOT EXISTS (
      SELECT 1 FROM user_roles ur2 WHERE ur2.user_id = ur.user_id AND ur2.role = 'PASTOR'
    )
    AND p.church_id IN (
      SELECT church_id 
      FROM profiles 
      WHERE church_id IS NOT NULL
      GROUP BY church_id 
      HAVING COUNT(*) = 1
    )
  LOOP
    -- Delete MEMBER role
    DELETE FROM user_roles WHERE user_id = pastor_user_id AND role = 'MEMBER';
    
    -- Add PASTOR role
    INSERT INTO user_roles (user_id, role)
    VALUES (pastor_user_id, 'PASTOR')
    ON CONFLICT (user_id, role) DO NOTHING;
  END LOOP;
END $$;