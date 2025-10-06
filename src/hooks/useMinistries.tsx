import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Ministry {
  id: string;
  church_id: string | null;
  name: string;
  description: string | null;
  leader_id: string | null;
  color: string;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useMinistries = () => {
  return useQuery({
    queryKey: ["ministries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ministries")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Ministry[];
    },
  });
};

export const useCreateMinistry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ministry: Omit<Ministry, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("ministries")
        .insert(ministry)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
    },
  });
};

export const useUpdateMinistry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Ministry> & { id: string }) => {
      const { data, error } = await supabase
        .from("ministries")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
    },
  });
};
