import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";

export interface Schedule {
  id: string;
  event_id: string;
  ministry_id: string;
  user_id: string;
  role: string;
  confirmed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduleWithDetails extends Schedule {
  profiles?: {
    name: string;
    phone: string | null;
    photo_url: string | null;
  };
  ministries?: {
    name: string;
    color: string;
  };
}

export interface ScheduleConflict {
  conflict_event_id: string;
  conflict_event_title: string;
  conflict_event_date: string;
  conflict_role: string;
}

export const useSchedules = (eventId?: string) => {
  const { user, hasAnyRole } = useAuth();
  const queryClient = useQueryClient();

  // Fetch schedules for an event
  const { data: schedules, isLoading, error } = useQuery({
    queryKey: ["schedules", eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data, error } = await supabase
        .from("schedules")
        .select(`
          *,
          profiles!schedules_user_id_fkey (name, phone, photo_url),
          ministries!schedules_ministry_id_fkey (name, color)
        `)
        .eq("event_id", eventId);

      if (error) throw error;
      return data as any as ScheduleWithDetails[];
    },
    enabled: !!eventId && !!user,
  });

  // Check for schedule conflicts
  const checkConflicts = async (userId: string, eventDate: string, excludeEventId?: string) => {
    const { data, error } = await supabase.rpc('check_schedule_conflicts', {
      _user_id: userId,
      _event_date: eventDate,
      _exclude_event_id: excludeEventId || null,
    });

    if (error) throw error;
    return data as ScheduleConflict[];
  };

  // Create schedule
  const createSchedule = useMutation({
    mutationFn: async (scheduleData: {
      event_id: string;
      ministry_id: string;
      user_id: string;
      role: string;
      event_date: string;
    }) => {
      if (!hasAnyRole(['PASTOR', 'LEADER'])) {
        throw new Error("Você não tem permissão para criar escalas");
      }

      // Check for conflicts first
      const conflicts = await checkConflicts(
        scheduleData.user_id,
        scheduleData.event_date,
        scheduleData.event_id
      );

      if (conflicts && conflicts.length > 0) {
        const conflict = conflicts[0];
        throw new Error(
          `Conflito de horário! ${scheduleData.user_id} já está escalado para "${conflict.conflict_event_title}" no mesmo horário como ${conflict.conflict_role}.`
        );
      }

      const { event_date, ...insertData } = scheduleData;

      const { data, error } = await supabase
        .from("schedules")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast({
        title: "Membro escalado!",
        description: "O membro foi adicionado à escala.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao escalar membro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update schedule (confirm/unconfirm)
  const updateSchedule = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Schedule> & { id: string }) => {
      const { data, error } = await supabase
        .from("schedules")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast({
        title: "Escala atualizada!",
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

  // Delete schedule
  const deleteSchedule = useMutation({
    mutationFn: async (scheduleId: string) => {
      if (!hasAnyRole(['PASTOR', 'LEADER'])) {
        throw new Error("Você não tem permissão para remover da escala");
      }

      const { error } = await supabase
        .from("schedules")
        .delete()
        .eq("id", scheduleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast({
        title: "Removido da escala",
        description: "O membro foi removido da escala.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Confirm schedule (by the user themselves)
  const confirmSchedule = useMutation({
    mutationFn: async (scheduleId: string) => {
      const { data, error } = await supabase
        .from("schedules")
        .update({ confirmed: true })
        .eq("id", scheduleId)
        .eq("user_id", user?.id) // Only allow users to confirm their own schedules
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast({
        title: "Presença confirmada!",
        description: "Sua participação foi confirmada.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao confirmar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    schedules: schedules || [],
    isLoading,
    error,
    checkConflicts,
    createSchedule: createSchedule.mutate,
    updateSchedule: updateSchedule.mutate,
    deleteSchedule: deleteSchedule.mutate,
    confirmSchedule: confirmSchedule.mutate,
    isCreating: createSchedule.isPending,
    isUpdating: updateSchedule.isPending,
    isDeleting: deleteSchedule.isPending,
    isConfirming: confirmSchedule.isPending,
  };
};

// Hook to get user's upcoming schedules
export const useMySchedules = () => {
  const { user } = useAuth();

  const { data: mySchedules, isLoading } = useQuery({
    queryKey: ["mySchedules", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("schedules")
        .select(`
          *,
          events!schedules_event_id_fkey (
            id,
            title,
            event_date,
            event_type,
            status
          ),
          ministries!schedules_ministry_id_fkey (name, color)
        `)
        .eq("user_id", user.id)
        .limit(10);

      if (error) throw error;

      // Filter for upcoming events manually since we can't filter on joined table in select
      const upcoming = data?.filter((schedule: any) => {
        return schedule.events && new Date(schedule.events.event_date) >= new Date();
      }).sort((a: any, b: any) => {
        return new Date(a.events.event_date).getTime() - new Date(b.events.event_date).getTime();
      });

      return upcoming || [];
    },
    enabled: !!user,
  });

  return {
    mySchedules: mySchedules || [],
    isLoading,
  };
};
