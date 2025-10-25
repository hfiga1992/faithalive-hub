-- Garantir que as tabelas existem com os campos corretos
CREATE TABLE IF NOT EXISTS ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(church_id, name)
);

CREATE TABLE IF NOT EXISTS ministry_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ministry_id UUID NOT NULL REFERENCES ministries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'MEMBER',
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(ministry_id, user_id)
);

-- Habilitar RLS
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministry_members ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Everyone can view ministries" ON ministries;
DROP POLICY IF EXISTS "PASTOR and LEADER can manage ministries" ON ministries;
DROP POLICY IF EXISTS "Everyone can view ministry members" ON ministry_members;
DROP POLICY IF EXISTS "PASTOR and LEADER can manage ministry members" ON ministry_members;
DROP POLICY IF EXISTS "Pastors and leaders can manage ministries" ON ministries;
DROP POLICY IF EXISTS "Users can view ministries in their church" ON ministries;
DROP POLICY IF EXISTS "Pastors and leaders can manage ministry members" ON ministry_members;
DROP POLICY IF EXISTS "Users can view ministry members in their church" ON ministry_members;

-- Criar políticas para ministries
CREATE POLICY "Users can view ministries in their church" 
ON ministries 
FOR SELECT 
USING (church_id = get_user_church_id(auth.uid()));

CREATE POLICY "Pastors and leaders can manage ministries" 
ON ministries 
FOR ALL 
USING (
  church_id = get_user_church_id(auth.uid())
  AND (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER'))
);

-- Criar políticas para ministry_members
CREATE POLICY "Users can view ministry members in their church" 
ON ministry_members 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM ministries 
    WHERE ministries.id = ministry_members.ministry_id 
    AND ministries.church_id = get_user_church_id(auth.uid())
  )
);

CREATE POLICY "Pastors and leaders can manage ministry members" 
ON ministry_members 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM ministries 
    WHERE ministries.id = ministry_members.ministry_id 
    AND ministries.church_id = get_user_church_id(auth.uid())
  )
  AND (has_role(auth.uid(), 'PASTOR') OR has_role(auth.uid(), 'LEADER'))
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_ministries_church_id ON ministries(church_id);
CREATE INDEX IF NOT EXISTS idx_ministries_leader_id ON ministries(leader_id);
CREATE INDEX IF NOT EXISTS idx_ministry_members_ministry_id ON ministry_members(ministry_id);
CREATE INDEX IF NOT EXISTS idx_ministry_members_user_id ON ministry_members(user_id);