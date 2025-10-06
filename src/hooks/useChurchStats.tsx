import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface ChurchStats {
  id: string;
  church_id: string;
  stat_date: string;
  total_members: number;
  active_members: number;
  new_members: number;
  events_count: number;
  average_attendance: number;
  created_at: string;
}

export const useChurchStats = (startDate?: string, endDate?: string) => {
  const { church } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["church-stats", church?.id, startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from("church_stats")
        .select("*")
        .order("stat_date", { ascending: false });

      if (startDate) {
        query = query.gte("stat_date", startDate);
      }

      if (endDate) {
        query = query.lte("stat_date", endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ChurchStats[];
    },
    enabled: !!church?.id,
  });

  return {
    stats: stats || [],
    isLoading,
  };
};

export const useCalculateStats = () => {
  const { church } = useAuth();

  const calculateStats = async (statDate: string) => {
    if (!church?.id) return;

    const { error } = await supabase.rpc('calculate_church_stats', {
      _church_id: church.id,
      _stat_date: statDate,
    });

    if (error) throw error;
  };

  return { calculateStats };
};