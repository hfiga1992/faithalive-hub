-- Fix all function search_path security warnings
-- Update has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update check_schedule_conflicts function  
CREATE OR REPLACE FUNCTION public.check_schedule_conflicts(_user_id uuid, _event_date timestamp with time zone, _exclude_event_id uuid DEFAULT NULL::uuid)
RETURNS TABLE(conflict_event_id uuid, conflict_event_title character varying, conflict_event_date timestamp with time zone, conflict_role character varying)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    e.id as conflict_event_id,
    e.title as conflict_event_title,
    e.event_date as conflict_event_date,
    s.role as conflict_role
  FROM public.schedules s
  JOIN public.events e ON e.id = s.event_id
  WHERE s.user_id = _user_id
    AND e.event_date::date = _event_date::date
    AND EXTRACT(HOUR FROM e.event_date) = EXTRACT(HOUR FROM _event_date)
    AND (_exclude_event_id IS NULL OR e.id != _exclude_event_id)
    AND e.status != 'CANCELLED';
$$;