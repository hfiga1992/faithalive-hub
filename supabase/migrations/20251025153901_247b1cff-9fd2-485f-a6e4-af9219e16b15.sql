-- Tabela para gerenciar os planos de cada igreja
CREATE TABLE IF NOT EXISTS church_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID UNIQUE NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL, -- 'freemium', 'premium', 'enterprise'
  max_leaders INT DEFAULT 1,
  max_members INT DEFAULT 100,
  features JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para gerenciar convites de novos usuários
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL, -- 'PASTOR', 'LEADER', 'MINISTER', 'MEMBER'
  token TEXT UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(church_id, email)
);

-- Tabela para rastrear o progresso do onboarding da igreja
CREATE TABLE IF NOT EXISTS church_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID UNIQUE NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  step INT DEFAULT 1, -- 1-5
  ministries_customized BOOLEAN DEFAULT false,
  first_leader_added BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE church_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE church_onboarding ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso (RLS Policies)
CREATE POLICY "Users can view their church plan"
ON church_plans
FOR SELECT
USING (church_id = (SELECT church_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "PASTOR can manage invitations"
ON invitations
FOR ALL
USING (
  church_id = (SELECT church_id FROM profiles WHERE id = auth.uid())
  AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'PASTOR'
  )
);

CREATE POLICY "Users can view their church onboarding"
ON church_onboarding
FOR SELECT
USING (church_id = (SELECT church_id FROM profiles WHERE id = auth.uid()));

-- Criar Índices para Performance
CREATE INDEX IF NOT EXISTS idx_church_plans_church_id ON church_plans(church_id);
CREATE INDEX IF NOT EXISTS idx_invitations_church_id ON invitations(church_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_church_onboarding_church_id ON church_onboarding(church_id);