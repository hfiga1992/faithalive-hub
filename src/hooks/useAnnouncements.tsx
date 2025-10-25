import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";
import { useEffect } from "react";
import { logQueryError } from "@/lib/queryConfig";

export interface Announcement {
  id: string;
  church_id: string;
  ministry_id: string | null;
  title: string;
  content: string;
  category: 'URGENT' | 'INFO' | 'EVENT' | 'PRAYER' | 'FINANCIAL';
  target_profiles: string[] | null;
  is_urgent: boolean;
  is_public: boolean;
  is_pinned: boolean;
  image_url: string | null;
  publish_at: string;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface AnnouncementFilters {
  category?: string;
  ministry_id?: string;
}

export const useAnnouncements = (filters: AnnouncementFilters = {}) => {
  const { user, church } = useAuth();
  const queryClient = useQueryClient();

  const announcementsQuery = useQuery({
    queryKey: ["announcements", church?.id, filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from("announcements")
          .select("*")
          .order("is_pinned", { ascending: false })
          .order("publish_at", { ascending: false });

        if (filters.category && filters.category !== 'all') {
          query = query.eq("category", filters.category);
        }

        if (filters.ministry_id && filters.ministry_id !== 'all') {
          query = query.eq("ministry_id", filters.ministry_id);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data as any[];
      } catch (error: any) {
        logQueryError('useAnnouncements', error);
        throw error;
      }
    },
    enabled: !!user && !!church,
  });

  const { data: announcements, isLoading, error, isError, refetch } = announcementsQuery;

  // Setup realtime subscription
  useEffect(() => {
    if (!church?.id) return;

    const channel = supabase
      .channel('announcements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements',
          filter: `church_id=eq.${church.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["announcements"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [church?.id, queryClient]);

  const createAnnouncement = useMutation({
    mutationFn: async (announcementData: any) => {
      if (!church?.id) {
        throw new Error("Igreja não encontrada");
      }

      const { data, error } = await supabase
        .from("announcements")
        .insert({
          ...announcementData,
          church_id: church.id,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({
        title: "Anúncio criado!",
        description: "O anúncio foi publicado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar anúncio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAnnouncement = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("announcements")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({
        title: "Anúncio atualizado!",
        description: "As alterações foram salvas.",
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

  const deleteAnnouncement = useMutation({
    mutationFn: async (announcementId: string) => {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", announcementId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({
        title: "Anúncio excluído",
        description: "O anúncio foi removido.",
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

  const markAsViewed = useMutation({
    mutationFn: async (announcementId: string) => {
      const { error } = await supabase
        .from("announcement_views")
        .insert({
          announcement_id: announcementId,
          user_id: user?.id,
        });

      if (error && !error.message.includes("duplicate")) {
        throw error;
      }
    },
  });

  return {
    announcements: announcements || [],
    isLoading,
    isError,
    error,
    refetch,
    createAnnouncement: createAnnouncement.mutate,
    updateAnnouncement: updateAnnouncement.mutate,
    deleteAnnouncement: deleteAnnouncement.mutate,
    markAsViewed: markAsViewed.mutate,
    isCreating: createAnnouncement.isPending,
    isUpdating: updateAnnouncement.isPending,
    isDeleting: deleteAnnouncement.isPending,
  };
};