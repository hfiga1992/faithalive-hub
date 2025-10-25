-- Atualizar tabela ministries com novos campos
ALTER TABLE ministries ADD COLUMN IF NOT EXISTS internal_id TEXT;
ALTER TABLE ministries ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;

-- Criar índice para internal_id
CREATE INDEX IF NOT EXISTS idx_ministries_internal_id ON ministries(church_id, internal_id);

-- Adicionar constraint único para internal_id por church
ALTER TABLE ministries ADD CONSTRAINT unique_internal_id_per_church UNIQUE(church_id, internal_id);