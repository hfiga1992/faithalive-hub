import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";

export interface Song {
  id: string;
  church_id: string;
  title: string;
  artist: string | null;
  original_key: string | null;
  bpm: number | null;
  lyrics: string | null;
  chords: string | null;
  duration_minutes: number | null;
  created_at: string;
  updated_at: string;
}

interface SongFilters {
  search?: string;
  artist?: string;
  key?: string;
}

export const useSongs = (filters: SongFilters = {}) => {
  const { user, church } = useAuth();
  const queryClient = useQueryClient();

  const { data: songs, isLoading, error } = useQuery({
    queryKey: ["songs", church?.id, filters],
    queryFn: async () => {
      let query = supabase
        .from("songs")
        .select("*")
        .order("title", { ascending: true });

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,artist.ilike.%${filters.search}%`);
      }

      if (filters.artist) {
        query = query.eq("artist", filters.artist);
      }

      if (filters.key) {
        query = query.eq("original_key", filters.key);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Song[];
    },
    enabled: !!user && !!church,
  });

  const createSong = useMutation({
    mutationFn: async (songData: Omit<Song, 'id' | 'created_at' | 'updated_at' | 'church_id'>) => {
      if (!church?.id) {
        throw new Error("Igreja não encontrada");
      }

      const { data, error } = await supabase
        .from("songs")
        .insert({
          ...songData,
          church_id: church.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      toast({
        title: "Música cadastrada!",
        description: "A música foi adicionada à biblioteca.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao cadastrar música",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateSong = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Song> & { id: string }) => {
      const { data, error } = await supabase
        .from("songs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      toast({
        title: "Música atualizada!",
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

  const deleteSong = useMutation({
    mutationFn: async (songId: string) => {
      const { error } = await supabase
        .from("songs")
        .delete()
        .eq("id", songId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      toast({
        title: "Música excluída",
        description: "A música foi removida da biblioteca.",
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
    songs: songs || [],
    isLoading,
    error,
    createSong: createSong.mutate,
    updateSong: updateSong.mutate,
    deleteSong: deleteSong.mutate,
    isCreating: createSong.isPending,
    isUpdating: updateSong.isPending,
    isDeleting: deleteSong.isPending,
  };
};