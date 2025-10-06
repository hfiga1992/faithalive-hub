-- Create songs table
CREATE TABLE public.songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  original_key VARCHAR(10),
  bpm INTEGER,
  lyrics TEXT,
  chords TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create worship_sets table
CREATE TABLE public.worship_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  church_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  songs_order JSONB DEFAULT '[]'::jsonb,
  total_duration INTEGER DEFAULT 0,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'DRAFT',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create song_history table
CREATE TABLE public.song_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  worship_set_id UUID REFERENCES worship_sets(id) ON DELETE CASCADE,
  key_used VARCHAR(10),
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worship_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for songs
CREATE POLICY "Users can view songs in their church"
  ON public.songs FOR SELECT
  USING (church_id = get_user_church_id(auth.uid()));

CREATE POLICY "Ministers and leaders can create songs"
  ON public.songs FOR INSERT
  WITH CHECK (
    church_id = get_user_church_id(auth.uid()) AND
    (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER') OR has_role(auth.uid(), 'MINISTER'))
  );

CREATE POLICY "Ministers and leaders can update songs"
  ON public.songs FOR UPDATE
  USING (
    church_id = get_user_church_id(auth.uid()) AND
    (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER') OR has_role(auth.uid(), 'MINISTER'))
  );

CREATE POLICY "Ministers and leaders can delete songs"
  ON public.songs FOR DELETE
  USING (
    church_id = get_user_church_id(auth.uid()) AND
    (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER') OR has_role(auth.uid(), 'MINISTER'))
  );

-- RLS Policies for worship_sets
CREATE POLICY "Users can view worship sets in their church"
  ON public.worship_sets FOR SELECT
  USING (church_id = get_user_church_id(auth.uid()));

CREATE POLICY "Ministers and leaders can create worship sets"
  ON public.worship_sets FOR INSERT
  WITH CHECK (
    church_id = get_user_church_id(auth.uid()) AND
    (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER') OR has_role(auth.uid(), 'MINISTER'))
  );

CREATE POLICY "Ministers and leaders can update worship sets"
  ON public.worship_sets FOR UPDATE
  USING (
    church_id = get_user_church_id(auth.uid()) AND
    (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER') OR has_role(auth.uid(), 'MINISTER'))
  );

CREATE POLICY "Ministers and leaders can delete worship sets"
  ON public.worship_sets FOR DELETE
  USING (
    church_id = get_user_church_id(auth.uid()) AND
    (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER') OR has_role(auth.uid(), 'MINISTER'))
  );

-- RLS Policies for song_history
CREATE POLICY "Users can view song history in their church"
  ON public.song_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM songs
      WHERE songs.id = song_history.song_id
      AND songs.church_id = get_user_church_id(auth.uid())
    )
  );

CREATE POLICY "Ministers and leaders can create song history"
  ON public.song_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM songs
      WHERE songs.id = song_history.song_id
      AND songs.church_id = get_user_church_id(auth.uid())
    ) AND
    (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER') OR has_role(auth.uid(), 'MINISTER'))
  );

-- Trigger for updating updated_at
CREATE TRIGGER update_songs_updated_at
  BEFORE UPDATE ON public.songs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worship_sets_updated_at
  BEFORE UPDATE ON public.worship_sets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();