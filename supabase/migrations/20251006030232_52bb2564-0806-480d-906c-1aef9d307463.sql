-- Create announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL,
  ministry_id UUID REFERENCES ministries(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  target_profiles TEXT[],
  is_urgent BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  image_url TEXT,
  publish_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcement_views table
CREATE TABLE public.announcement_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(announcement_id, user_id)
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for announcements
CREATE POLICY "Users can view announcements in their church"
  ON public.announcements FOR SELECT
  USING (
    church_id = get_user_church_id(auth.uid()) AND
    (
      -- Public announcements
      is_public = true OR
      -- User's profile is in target_profiles
      target_profiles IS NULL OR
      EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role::text = ANY(target_profiles)
      ) OR
      -- User is in the ministry
      (ministry_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM ministry_members
        WHERE ministry_members.ministry_id = announcements.ministry_id
        AND ministry_members.user_id = auth.uid()
      ))
    ) AND
    -- Only show published announcements
    publish_at <= NOW() AND
    (expires_at IS NULL OR expires_at > NOW())
  );

CREATE POLICY "Pastors can create all announcements"
  ON public.announcements FOR INSERT
  WITH CHECK (
    church_id = get_user_church_id(auth.uid()) AND
    has_role(auth.uid(), 'PASTOR')
  );

CREATE POLICY "Leaders can create ministry announcements"
  ON public.announcements FOR INSERT
  WITH CHECK (
    church_id = get_user_church_id(auth.uid()) AND
    has_role(auth.uid(), 'LEADER') AND
    (
      ministry_id IS NULL OR
      EXISTS (
        SELECT 1 FROM ministry_members
        WHERE ministry_members.ministry_id = announcements.ministry_id
        AND ministry_members.user_id = auth.uid()
        AND ministry_members.role = 'LEADER'
      )
    )
  );

CREATE POLICY "Pastors and leaders can update their announcements"
  ON public.announcements FOR UPDATE
  USING (
    church_id = get_user_church_id(auth.uid()) AND
    (
      has_role(auth.uid(), 'PASTOR') OR
      (has_role(auth.uid(), 'LEADER') AND created_by = auth.uid())
    )
  );

CREATE POLICY "Pastors and leaders can delete their announcements"
  ON public.announcements FOR DELETE
  USING (
    church_id = get_user_church_id(auth.uid()) AND
    (
      has_role(auth.uid(), 'PASTOR') OR
      (has_role(auth.uid(), 'LEADER') AND created_by = auth.uid())
    )
  );

-- RLS Policies for announcement_views
CREATE POLICY "Users can view their own announcement views"
  ON public.announcement_views FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own announcement views"
  ON public.announcement_views FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Enable realtime for announcements
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;

-- Trigger for updating updated_at
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();