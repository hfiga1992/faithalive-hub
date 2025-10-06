-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'PRESENT',
  recorded_by UUID,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create church_stats table
CREATE TABLE public.church_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL,
  stat_date DATE NOT NULL,
  total_members INTEGER DEFAULT 0,
  active_members INTEGER DEFAULT 0,
  new_members INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  average_attendance DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(church_id, stat_date)
);

-- Enable RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for attendance
CREATE POLICY "Users can view attendance in their church"
  ON public.attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = attendance.event_id
      AND events.church_id = get_user_church_id(auth.uid())
    )
  );

CREATE POLICY "Pastors and leaders can create attendance"
  ON public.attendance FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = attendance.event_id
      AND events.church_id = get_user_church_id(auth.uid())
    ) AND
    (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER'))
  );

CREATE POLICY "Pastors and leaders can update attendance"
  ON public.attendance FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = attendance.event_id
      AND events.church_id = get_user_church_id(auth.uid())
    ) AND
    (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER'))
  );

CREATE POLICY "Pastors and leaders can delete attendance"
  ON public.attendance FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = attendance.event_id
      AND events.church_id = get_user_church_id(auth.uid())
    ) AND
    (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER'))
  );

-- RLS Policies for church_stats
CREATE POLICY "Pastors can view church stats"
  ON public.church_stats FOR SELECT
  USING (
    church_id = get_user_church_id(auth.uid()) AND
    has_role(auth.uid(), 'PASTOR')
  );

CREATE POLICY "Pastors can create church stats"
  ON public.church_stats FOR INSERT
  WITH CHECK (
    church_id = get_user_church_id(auth.uid()) AND
    has_role(auth.uid(), 'PASTOR')
  );

-- Function to calculate church statistics
CREATE OR REPLACE FUNCTION calculate_church_stats(_church_id uuid, _stat_date date)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _total_members integer;
  _active_members integer;
  _new_members integer;
  _events_count integer;
  _avg_attendance decimal(5,2);
BEGIN
  -- Count total members
  SELECT COUNT(*) INTO _total_members
  FROM profiles
  WHERE church_id = _church_id;
  
  -- Count active members (status = ACTIVE)
  SELECT COUNT(*) INTO _active_members
  FROM profiles
  WHERE church_id = _church_id
  AND status = 'ACTIVE';
  
  -- Count new members (created in the last 30 days)
  SELECT COUNT(*) INTO _new_members
  FROM profiles
  WHERE church_id = _church_id
  AND created_at >= _stat_date - INTERVAL '30 days'
  AND created_at < _stat_date + INTERVAL '1 day';
  
  -- Count events in the last 30 days
  SELECT COUNT(*) INTO _events_count
  FROM events
  WHERE church_id = _church_id
  AND event_date >= _stat_date - INTERVAL '30 days'
  AND event_date < _stat_date + INTERVAL '1 day'
  AND status = 'FINISHED';
  
  -- Calculate average attendance
  SELECT COALESCE(AVG(attendance_count), 0) INTO _avg_attendance
  FROM (
    SELECT COUNT(*) as attendance_count
    FROM attendance a
    JOIN events e ON e.id = a.event_id
    WHERE e.church_id = _church_id
    AND e.event_date >= _stat_date - INTERVAL '30 days'
    AND e.event_date < _stat_date + INTERVAL '1 day'
    AND a.status = 'PRESENT'
    GROUP BY a.event_id
  ) sub;
  
  -- Insert or update stats
  INSERT INTO church_stats (
    church_id,
    stat_date,
    total_members,
    active_members,
    new_members,
    events_count,
    average_attendance
  ) VALUES (
    _church_id,
    _stat_date,
    _total_members,
    _active_members,
    _new_members,
    _events_count,
    _avg_attendance
  )
  ON CONFLICT (church_id, stat_date)
  DO UPDATE SET
    total_members = EXCLUDED.total_members,
    active_members = EXCLUDED.active_members,
    new_members = EXCLUDED.new_members,
    events_count = EXCLUDED.events_count,
    average_attendance = EXCLUDED.average_attendance;
END;
$$;