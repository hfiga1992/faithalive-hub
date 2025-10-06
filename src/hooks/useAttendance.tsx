import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";

export interface AttendanceRecord {
  id: string;
  event_id: string;
  user_id: string;
  status: 'PRESENT' | 'ABSENT' | 'JUSTIFIED';
  recorded_by: string | null;
  recorded_at: string;
  notes: string | null;
  created_at: string;
}

export const useAttendance = (eventId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: attendance, isLoading } = useQuery({
    queryKey: ["attendance", eventId],
    queryFn: async () => {
      let query = supabase
        .from("attendance")
        .select("*");

      if (eventId) {
        query = query.eq("event_id", eventId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as any[];
    },
    enabled: !!user && !!eventId,
  });

  const recordAttendance = useMutation({
    mutationFn: async (data: { event_id: string; user_id: string; status: string; notes?: string }) => {
      const { data: result, error } = await supabase
        .from("attendance")
        .upsert({
          event_id: data.event_id,
          user_id: data.user_id,
          status: data.status,
          notes: data.notes || null,
          recorded_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast({
        title: "Presença registrada!",
        description: "O registro foi salvo com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao registrar presença",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    attendance: attendance || [],
    isLoading,
    recordAttendance: recordAttendance.mutate,
    isRecording: recordAttendance.isPending,
  };
};

export const useUserAttendance = (userId?: string) => {
  const { data: attendance, isLoading } = useQuery({
    queryKey: ["user-attendance", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attendance")
        .select(`
          *,
          events (
            id,
            title,
            event_date,
            event_type
          )
        `)
        .eq("user_id", userId)
        .order("recorded_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  return {
    attendance: attendance || [],
    isLoading,
  };
};