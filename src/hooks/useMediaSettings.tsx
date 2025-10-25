import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logQueryError } from '@/lib/queryConfig';
import { toast } from 'sonner';

export interface MediaSettings {
  id: string;
  church_id: string;
  google_drive_folder_id: string;
  google_drive_credentials: any;
  google_drive_email?: string;
  is_connected: boolean;
  last_sync?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMediaSettings {
  google_drive_folder_id: string;
  google_drive_credentials: any;
  google_drive_email?: string;
  is_connected?: boolean;
}

export const useMediaSettings = () => {
  const { church } = useAuth();
  const queryClient = useQueryClient();

  const { data, error, isError, isLoading, refetch } = useQuery({
    queryKey: ['media-settings', church?.id],
    queryFn: async () => {
      if (!church?.id) throw new Error('Church ID not found');

      const { data, error } = await supabase
        .from('media_settings')
        .select('*')
        .eq('church_id', church.id)
        .maybeSingle();

      if (error) {
        logQueryError('useMediaSettings - fetch', error);
        throw error;
      }

      return data as MediaSettings | null;
    },
    enabled: !!church?.id,
  });

  const createMutation = useMutation({
    mutationFn: async (settings: CreateMediaSettings) => {
      if (!church?.id) throw new Error('Church ID not found');

      const { data, error } = await supabase
        .from('media_settings')
        .insert([{
          church_id: church.id,
          google_drive_folder_id: settings.google_drive_folder_id,
          google_drive_credentials: settings.google_drive_credentials,
          google_drive_email: settings.google_drive_email,
          is_connected: settings.is_connected ?? true,
        }])
        .select()
        .single();

      if (error) {
        logQueryError('useMediaSettings - create', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-settings'] });
      toast.success('Configurações salvas com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao salvar configurações');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (settings: Partial<MediaSettings>) => {
      if (!church?.id) throw new Error('Church ID not found');
      if (!data?.id) throw new Error('Settings ID not found');

      const { data: updated, error } = await supabase
        .from('media_settings')
        .update(settings)
        .eq('id', data.id)
        .select()
        .single();

      if (error) {
        logQueryError('useMediaSettings - update', error);
        throw error;
      }

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-settings'] });
      toast.success('Configurações atualizadas com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar configurações');
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      if (!data?.id) throw new Error('Settings ID not found');

      const { error } = await supabase
        .from('media_settings')
        .update({ is_connected: false })
        .eq('id', data.id);

      if (error) {
        logQueryError('useMediaSettings - disconnect', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-settings'] });
      toast.success('Google Drive desconectado');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao desconectar');
    },
  });

  return {
    settings: data,
    error,
    isError,
    isLoading,
    refetch,
    createSettings: createMutation.mutate,
    updateSettings: updateMutation.mutate,
    disconnect: disconnectMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDisconnecting: disconnectMutation.isPending,
  };
};
