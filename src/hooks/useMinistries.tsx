import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logQueryError } from "@/lib/queryConfig";
import { toast } from "./use-toast";

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
  const query = useQuery({
    queryKey: ["ministries"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("ministries")
          .select("*")
          .order("name");

        if (error) throw error;
        return data as Ministry[];
      } catch (error: any) {
        logQueryError('useMinistries', error);
        throw error;
      }
    },
  });

  return {
    ...query,
    ministries: query.data || [],
    isError: query.isError,
    refetch: query.refetch,
  };
};

export const useCreateMinistry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ministry: Omit<Ministry, "id" | "created_at" | "updated_at">) => {
      try {
        const { data, error} = await supabase
          .from("ministries")
          .insert(ministry)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error: any) {
        logQueryError('useCreateMinistry', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
      toast({
        title: "Ministério criado!",
        description: "O ministério foi adicionado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar ministério",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMinistry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Ministry> & { id: string }) => {
      try {
        const { data, error } = await supabase
          .from("ministries")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error: any) {
        logQueryError('useUpdateMinistry', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
      toast({
        title: "Ministério atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar ministério",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
