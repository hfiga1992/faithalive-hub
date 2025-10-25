-- Criar tabela media_settings
CREATE TABLE IF NOT EXISTS media_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  google_drive_folder_id TEXT NOT NULL,
  google_drive_credentials JSONB NOT NULL,
  google_drive_email TEXT,
  is_connected BOOLEAN DEFAULT true,
  last_sync TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(church_id)
);

-- Habilitar RLS
ALTER TABLE media_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Apenas PASTOR da igreja pode ver/editar
CREATE POLICY "PASTOR can manage media settings" 
ON media_settings 
FOR ALL 
USING (
  church_id = (SELECT church_id FROM profiles WHERE id = auth.uid())
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'PASTOR'
  )
);

-- Criar índice para performance
CREATE INDEX idx_media_settings_church_id ON media_settings(church_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_media_settings_updated_at
BEFORE UPDATE ON media_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();