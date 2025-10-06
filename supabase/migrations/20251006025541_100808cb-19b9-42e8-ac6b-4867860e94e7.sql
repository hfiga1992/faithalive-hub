-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('CULTO_DOMINGO', 'CULTO_QUARTA', 'EVENTO_ESPECIAL', 'ENSAIO', 'REUNIAO')),
  status VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schedules table
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  ministry_id UUID REFERENCES public.ministries(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role VARCHAR(100) NOT NULL,
  confirmed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id, role)
);

-- Create ministry_roles table for customizable roles per ministry
CREATE TABLE public.ministry_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ministry_id UUID REFERENCES public.ministries(id) ON DELETE CASCADE NOT NULL,
  role_name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ministry_id, role_name)
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Users can view events in their church"
  ON public.events FOR SELECT
  TO authenticated
  USING (church_id = public.get_user_church_id(auth.uid()));

CREATE POLICY "Pastors and leaders can create events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (
    church_id = public.get_user_church_id(auth.uid()) AND
    (public.has_role(auth.uid(), 'PASTOR') OR public.has_role(auth.uid(), 'LEADER'))
  );

CREATE POLICY "Pastors and leaders can update events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (
    church_id = public.get_user_church_id(auth.uid()) AND
    (public.has_role(auth.uid(), 'PASTOR') OR public.has_role(auth.uid(), 'LEADER'))
  );

CREATE POLICY "Pastors and leaders can delete events"
  ON public.events FOR DELETE
  TO authenticated
  USING (
    church_id = public.get_user_church_id(auth.uid()) AND
    (public.has_role(auth.uid(), 'PASTOR') OR public.has_role(auth.uid(), 'LEADER'))
  );

-- RLS Policies for schedules
CREATE POLICY "Users can view schedules in their church"
  ON public.schedules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE id = schedules.event_id
        AND church_id = public.get_user_church_id(auth.uid())
    )
  );

CREATE POLICY "Pastors and leaders can manage schedules"
  ON public.schedules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE id = schedules.event_id
        AND church_id = public.get_user_church_id(auth.uid())
    ) AND
    (public.has_role(auth.uid(), 'PASTOR') OR public.has_role(auth.uid(), 'LEADER'))
  );

CREATE POLICY "Users can update their own schedule confirmation"
  ON public.schedules FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for ministry_roles
CREATE POLICY "Users can view ministry roles in their church"
  ON public.ministry_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ministries
      WHERE id = ministry_roles.ministry_id
        AND church_id = public.get_user_church_id(auth.uid())
    )
  );

CREATE POLICY "Pastors and leaders can manage ministry roles"
  ON public.ministry_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ministries
      WHERE id = ministry_roles.ministry_id
        AND church_id = public.get_user_church_id(auth.uid())
    ) AND
    (public.has_role(auth.uid(), 'PASTOR') OR public.has_role(auth.uid(), 'LEADER'))
  );

-- Function to detect schedule conflicts
CREATE OR REPLACE FUNCTION public.check_schedule_conflicts(
  _user_id UUID,
  _event_date TIMESTAMP WITH TIME ZONE,
  _exclude_event_id UUID DEFAULT NULL
)
RETURNS TABLE (
  conflict_event_id UUID,
  conflict_event_title VARCHAR,
  conflict_event_date TIMESTAMP WITH TIME ZONE,
  conflict_role VARCHAR
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
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

-- Insert default ministry roles
INSERT INTO public.ministry_roles (ministry_id, role_name, description)
SELECT m.id, role.name, role.description
FROM public.ministries m
CROSS JOIN (
  VALUES 
    ('Vocal', 'Cantor principal ou backing vocal'),
    ('Guitarra', 'Guitarrista'),
    ('Baixo', 'Baixista'),
    ('Bateria', 'Baterista'),
    ('Teclado', 'Tecladista')
) AS role(name, description)
WHERE m.name = 'Louvor'
ON CONFLICT (ministry_id, role_name) DO NOTHING;

INSERT INTO public.ministry_roles (ministry_id, role_name, description)
SELECT m.id, role.name, role.description
FROM public.ministries m
CROSS JOIN (
  VALUES 
    ('Câmera', 'Operador de câmera'),
    ('Streaming', 'Responsável pela transmissão online'),
    ('Slides', 'Operador de slides/projeção')
) AS role(name, description)
WHERE m.name = 'Mídia'
ON CONFLICT (ministry_id, role_name) DO NOTHING;

INSERT INTO public.ministry_roles (ministry_id, role_name, description)
SELECT m.id, role.name, role.description
FROM public.ministries m
CROSS JOIN (
  VALUES 
    ('Som', 'Operador de som'),
    ('Iluminação', 'Operador de iluminação')
) AS role(name, description)
WHERE m.name = 'Áudio Visual'
ON CONFLICT (ministry_id, role_name) DO NOTHING;

INSERT INTO public.ministry_roles (ministry_id, role_name, description)
SELECT m.id, role.name, role.description
FROM public.ministries m
CROSS JOIN (
  VALUES 
    ('Recepção', 'Recepcionista'),
    ('Segurança', 'Segurança'),
    ('Limpeza', 'Responsável pela limpeza')
) AS role(name, description)
WHERE m.name = 'Diaconato'
ON CONFLICT (ministry_id, role_name) DO NOTHING;

INSERT INTO public.ministry_roles (ministry_id, role_name, description)
SELECT m.id, role.name, role.description
FROM public.ministries m
CROSS JOIN (
  VALUES 
    ('Professor', 'Professor de crianças'),
    ('Auxiliar', 'Auxiliar de sala'),
    ('Recreação', 'Responsável por atividades recreativas')
) AS role(name, description)
WHERE m.name = 'KIDS'
ON CONFLICT (ministry_id, role_name) DO NOTHING;

-- Trigger for updated_at on events
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on schedules
CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON public.schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();