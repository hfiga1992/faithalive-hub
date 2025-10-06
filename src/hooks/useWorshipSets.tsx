import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";

export interface WorshipSetSong {
  song_id: string;
  key?: string;
  notes?: string;
}

export interface WorshipSet {
  id: string;
  event_id: string | null;
  church_id: string;
  title: string;
  songs_order: any;
  total_duration: number;
  notes: string | null;
  status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useWorshipSets = (eventId?: string) => {
  const { user, church } = useAuth();
  const queryClient = useQueryClient();

  const { data: worshipSets, isLoading, error } = useQuery({
    queryKey: ["worship_sets", church?.id, eventId],
    queryFn: async () => {
      let query = supabase
        .from("worship_sets")
        .select("*")
        .order("created_at", { ascending: false });

      if (eventId) {
        query = query.eq("event_id", eventId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as any[];
    },
    enabled: !!user && !!church,
  });

  const createWorshipSet = useMutation({
    mutationFn: async (setData: any) => {
      if (!church?.id) {
        throw new Error("Igreja não encontrada");
      }

      const { data, error } = await supabase
        .from("worship_sets")
        .insert({
          title: setData.title,
          event_id: setData.event_id || null,
          songs_order: setData.songs_order || [],
          total_duration: setData.total_duration || 0,
          notes: setData.notes || null,
          status: setData.status || 'DRAFT',
          church_id: church.id,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worship_sets"] });
      toast({
        title: "Setlist criada!",
        description: "A setlist foi adicionada ao evento.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar setlist",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateWorshipSet = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WorshipSet> & { id: string }) => {
      const { data, error } = await supabase
        .from("worship_sets")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worship_sets"] });
      toast({
        title: "Setlist atualizada!",
        description: "As informações foram salvas.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteWorshipSet = useMutation({
    mutationFn: async (setId: string) => {
      const { error } = await supabase
        .from("worship_sets")
        .delete()
        .eq("id", setId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worship_sets"] });
      toast({
        title: "Setlist excluída",
        description: "A setlist foi removida.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    worshipSets: worshipSets || [],
    isLoading,
    error,
    createWorshipSet: createWorshipSet.mutate,
    updateWorshipSet: updateWorshipSet.mutate,
    deleteWorshipSet: deleteWorshipSet.mutate,
    isCreating: createWorshipSet.isPending,
    isUpdating: updateWorshipSet.isPending,
    isDeleting: deleteWorshipSet.isPending,
  };
};