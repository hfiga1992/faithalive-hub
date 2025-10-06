-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('PASTOR', 'LEADER', 'MINISTER', 'MEMBER', 'VISITOR');

-- Churches table
CREATE TABLE public.churches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  photo_url TEXT,
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Ministries table
CREATE TABLE public.ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID REFERENCES public.churches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ministry members table
CREATE TABLE public.ministry_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ministry_id UUID REFERENCES public.ministries(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'MEMBER',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ministry_id)
);

-- Enable RLS
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_members ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Security definer function to get user's church_id
CREATE OR REPLACE FUNCTION public.get_user_church_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT church_id
  FROM public.profiles
  WHERE id = _user_id
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in their church"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    church_id = public.get_user_church_id(auth.uid())
  );

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Pastors and leaders can view all roles in their church"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'PASTOR') OR 
    public.has_role(auth.uid(), 'LEADER')
  );

-- RLS Policies for churches
CREATE POLICY "Users can view their own church"
  ON public.churches FOR SELECT
  TO authenticated
  USING (
    id = public.get_user_church_id(auth.uid())
  );

CREATE POLICY "Pastors can update their church"
  ON public.churches FOR UPDATE
  TO authenticated
  USING (
    id = public.get_user_church_id(auth.uid()) AND
    public.has_role(auth.uid(), 'PASTOR')
  );

-- RLS Policies for ministries
CREATE POLICY "Users can view ministries in their church"
  ON public.ministries FOR SELECT
  TO authenticated
  USING (
    church_id = public.get_user_church_id(auth.uid())
  );

CREATE POLICY "Pastors and leaders can manage ministries"
  ON public.ministries FOR ALL
  TO authenticated
  USING (
    church_id = public.get_user_church_id(auth.uid()) AND
    (public.has_role(auth.uid(), 'PASTOR') OR public.has_role(auth.uid(), 'LEADER'))
  );

-- RLS Policies for ministry_members
CREATE POLICY "Users can view ministry members in their church"
  ON public.ministry_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ministries
      WHERE id = ministry_members.ministry_id
        AND church_id = public.get_user_church_id(auth.uid())
    )
  );

CREATE POLICY "Pastors and leaders can manage ministry members"
  ON public.ministry_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ministries
      WHERE id = ministry_members.ministry_id
        AND church_id = public.get_user_church_id(auth.uid())
    ) AND
    (public.has_role(auth.uid(), 'PASTOR') OR public.has_role(auth.uid(), 'LEADER'))
  );

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, church_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    (NEW.raw_user_meta_data->>'church_id')::UUID
  );
  
  -- Assign default MEMBER role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'MEMBER');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_churches_updated_at
  BEFORE UPDATE ON public.churches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ministries_updated_at
  BEFORE UPDATE ON public.ministries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();