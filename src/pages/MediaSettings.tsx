import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useMediaSettings } from '@/hooks/useMediaSettings';
import { ErrorFallback } from '@/components/error/ErrorFallback';
import { CardSkeleton } from '@/components/ui/loading-skeleton';
import { HardDrive, AlertCircle, CheckCircle2, Unplug } from 'lucide-react';

export default function MediaSettings() {
  const {
    settings,
    error,
    isError,
    isLoading,
    refetch,
    createSettings,
    updateSettings,
    disconnect,
    isCreating,
    isUpdating,
    isDisconnecting,
  } = useMediaSettings();

  const [folderId, setFolderId] = useState(settings?.google_drive_folder_id || '');
  const [credentials, setCredentials] = useState(
    settings?.google_drive_credentials ? JSON.stringify(settings.google_drive_credentials, null, 2) : ''
  );
  const [email, setEmail] = useState(settings?.google_drive_email || '');

  const handleSave = () => {
    try {
      const parsedCredentials = JSON.parse(credentials);
      
      const settingsData = {
        google_drive_folder_id: folderId,
        google_drive_credentials: parsedCredentials,
        google_drive_email: email,
        is_connected: true,
      };

      if (settings) {
        updateSettings(settingsData);
      } else {
        createSettings(settingsData);
      }
    } catch (err) {
      alert('JSON de credenciais inválido. Verifique o formato.');
    }
  };

  const handleDisconnect = () => {
    if (confirm('Tem certeza que deseja desconectar o Google Drive?')) {
      disconnect();
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <CardSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <ErrorFallback error={error} onRetry={refetch} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configurações de Mídia</h1>
            <p className="text-muted-foreground mt-2">
              Conecte seu Google Drive para armazenar e gerenciar mídias da igreja
            </p>
          </div>
          {settings?.is_connected && (
            <Badge variant="default" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Conectado
            </Badge>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <HardDrive className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Google Drive</CardTitle>
                <CardDescription>
                  Configure a integração com Google Drive para gerenciar mídias
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {settings?.error_message && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{settings.error_message}</AlertDescription>
              </Alert>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Como obter as credenciais do Google Drive:</strong>
                <ol className="list-decimal ml-4 mt-2 space-y-1">
                  <li>Acesse o <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a></li>
                  <li>Crie um novo projeto ou selecione um existente</li>
                  <li>Ative a API do Google Drive</li>
                  <li>Crie credenciais do tipo "Service Account"</li>
                  <li>Baixe o arquivo JSON de credenciais</li>
                  <li>Compartilhe a pasta do Drive com o email da service account</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="folder-id">ID da Pasta do Google Drive</Label>
                <Input
                  id="folder-id"
                  placeholder="Ex: 1a2b3c4d5e6f7g8h9i0j"
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  O ID está na URL da pasta: drive.google.com/drive/folders/<strong>[ID]</strong>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email da Service Account (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="service-account@projeto.iam.gserviceaccount.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentials">Credenciais JSON</Label>
                <Textarea
                  id="credentials"
                  placeholder='{"type": "service_account", "project_id": "...", ...}'
                  value={credentials}
                  onChange={(e) => setCredentials(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Cole aqui o conteúdo completo do arquivo JSON de credenciais
                </p>
              </div>
            </div>

            {settings?.last_sync && (
              <div className="text-sm text-muted-foreground">
                Última sincronização: {new Date(settings.last_sync).toLocaleString('pt-BR')}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={!folderId || !credentials || isCreating || isUpdating}
                className="flex-1"
              >
                {isCreating || isUpdating ? 'Salvando...' : settings ? 'Atualizar Configurações' : 'Conectar Google Drive'}
              </Button>
              
              {settings?.is_connected && (
                <Button
                  variant="destructive"
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                >
                  <Unplug className="h-4 w-4 mr-2" />
                  {isDisconnecting ? 'Desconectando...' : 'Desconectar'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
