import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";

export interface Event {
  id: string;
  church_id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_type: 'CULTO_DOMINGO' | 'CULTO_QUARTA' | 'EVENTO_ESPECIAL' | 'ENSAIO' | 'REUNIAO';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELLED';
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface EventFilters {
  month?: number;
  year?: number;
  type?: string;
  status?: string;
}

export const useEvents = (filters: EventFilters = {}) => {
  const { user, hasAnyRole } = useAuth();
  const queryClient = useQueryClient();

  // Fetch events
  const { data: events, isLoading, error } = useQuery({
    queryKey: ["events", filters],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      // Apply filters
      if (filters.month && filters.year) {
        const startDate = new Date(filters.year, filters.month - 1, 1);
        const endDate = new Date(filters.year, filters.month, 0, 23, 59, 59);
        query = query
          .gte('event_date', startDate.toISOString())
          .lte('event_date', endDate.toISOString());
      }

      if (filters.type && filters.type !== 'all') {
        query = query.eq('event_type', filters.type);
      }

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Event[];
    },
    enabled: !!user,
  });

  // Create event
  const createEvent = useMutation({
    mutationFn: async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      if (!hasAnyRole(['PASTOR', 'LEADER'])) {
        throw new Error("Você não tem permissão para criar eventos");
      }

      const { data, error } = await supabase
        .from("events")
        .insert({
          ...eventData,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Evento criado!",
        description: "O evento foi adicionado ao calendário.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar evento",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update event
  const updateEvent = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Event> & { id: string }) => {
      if (!hasAnyRole(['PASTOR', 'LEADER'])) {
        throw new Error("Você não tem permissão para atualizar eventos");
      }

      const { data, error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Evento atualizado!",
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

  // Delete event
  const deleteEvent = useMutation({
    mutationFn: async (eventId: string) => {
      if (!hasAnyRole(['PASTOR', 'LEADER'])) {
        throw new Error("Você não tem permissão para excluir eventos");
      }

      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Evento excluído",
        description: "O evento foi removido do calendário.",
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
    events: events || [],
    isLoading,
    error,
    createEvent: createEvent.mutate,
    updateEvent: updateEvent.mutate,
    deleteEvent: deleteEvent.mutate,
    isCreating: createEvent.isPending,
    isUpdating: updateEvent.isPending,
    isDeleting: deleteEvent.isPending,
  };
};
